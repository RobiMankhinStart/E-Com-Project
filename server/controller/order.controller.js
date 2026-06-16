const cartSchema = require("../models/cartSchema");
const OrderSchema = require("../models/OrderSchema");
const productSchema = require("../models/productSchema");
const { responseHandler } = require("../services/responseHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT;
const checkOut = async (req, res) => {
  const { paymentType, cartId, shippingAddress, insideDhaka } = req.body;
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const orderNumber = `ORD-${uniqueId}`;

  if (
    !paymentType ||
    !shippingAddress ||
    insideDhaka === undefined ||
    insideDhaka === null
  )
    return responseHandler.error(res, 400, "All fields are required.");

  try {
    // Normalize shippingAddress: accept object or string (legacy)
    let shippingAddrToSave = shippingAddress;
    if (typeof shippingAddrToSave === "string") {
      try {
        shippingAddrToSave = JSON.parse(shippingAddrToSave);
      } catch {
        shippingAddrToSave = {
          firstName: "Guest",
          lastName: "",
          address: shippingAddrToSave,
          city: "",
          state: "",
          zip: "",
        };
      }
    }
    // ensure required fields exist (use safe defaults to avoid validation errors)
    shippingAddrToSave.firstName = shippingAddrToSave.firstName || "Guest";
    shippingAddrToSave.lastName = shippingAddrToSave.lastName || "";
    shippingAddrToSave.address = shippingAddrToSave.address || "";
    shippingAddrToSave.city = shippingAddrToSave.city || "";
    shippingAddrToSave.state = shippingAddrToSave.state || "";
    shippingAddrToSave.zip = shippingAddrToSave.zip || "";
    const cartQuery = cartId
      ? { _id: cartId, user: req.user._id }
      : { user: req.user._id };
    const cartData = await cartSchema.findOne(cartQuery);
    if (!cartData)
      return responseHandler.error(
        res,
        400,
        "Cart not found or unauthorized access",
      );

    if (!cartData.items || cartData.items.length === 0)
      return responseHandler.error(res, 400, "Cart is empty");

    const isInsideDhaka =
      insideDhaka === true || String(insideDhaka).toLowerCase() === "true";
    const charge = isInsideDhaka ? 80 : 120;
    const totalPrice = cartData.items.reduce((total, current) => {
      return (total += current.subtotal);
    }, charge);

    const orderData = new OrderSchema({
      user: req.user._id,
      items: cartData.items,
      shippingAddress: shippingAddrToSave,
      insideDhaka: isInsideDhaka,
      deliveryCharge: charge,
      totalPrice,
      payment: {
        method: paymentType,
      },
      orderNumber,
    });
    await orderData.save();

    if (paymentType === "cash") {
      await cartSchema.deleteOne({ user: req.user._id });
      return responseHandler.success(
        res,
        200,
        { order: orderData },
        "Order successfully completed.",
      );
    }

    // Build line items from actual cart items
    const lineItems = await Promise.all(
      cartData.items.map(async (item) => {
        const product = await productSchema.findById(item.product);
        return {
          price_data: {
            currency: "BDT",
            product_data: {
              name: product.title,
              description: product.description.substring(0, 100),
            },
            unit_amount: Math.round((item.subtotal / item.quantity) * 100),
          },
          quantity: item.quantity,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: `${req.user.email}`,
      metadata: {
        orderId: `${orderData._id}`,
      },
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/checkout/cancel`,
    });

    return responseHandler.success(
      res,
      200,
      { sessionUrl: session.url, order: orderData },
      "Checkout session created.",
    );
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 500, error.message);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderSchema.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return responseHandler.success(res, 200, {
      orders,
    });
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const webhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("Webhook event type:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const order = await OrderSchema.findById(session.metadata.orderId);
      if (!order) {
        console.error("Order not found for session:", session.metadata.orderId);
        return res.status(200).json({ received: true });
      }

      if (session.amount_total / 100 !== order.totalPrice) {
        console.error(
          "Payment amount mismatch for order:",
          session.metadata.orderId,
        );
      }

      // Payment Saving in the database
      await OrderSchema.findByIdAndUpdate(session.metadata.orderId, {
        "payment.status": "paid",
        "payment.paymentId": session.id,
        "payment.currency": session.currency,
        "payment.fullname": session.customer_details?.name,
        "payment.email": session.customer_details?.email,
        "payment.paidAmount": session.amount_total,
        "payment.paidAt": new Date(),
      });

      await cartSchema.deleteOne({ user: order.user });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
  }

  return res.status(200).json({ received: true });
};

module.exports = { checkOut, getAllOrders, webhook };
