const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const { responseHandler } = require("../services/responseHandler");
const isValidId = require("../services/isValidId");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    if (!productId || !sku || !quantity)
      return responseHandler.error(res, 400, "Invalid request.");

    const productData = await productSchema.findById(productId);
    if (!productData)
      return responseHandler.error(res, 400, "Product not found");

    const variantExists = productData.variants.some((v) => v.sku === sku);
    if (!variantExists)
      return responseHandler.error(
        res,
        400,
        "SKU does not exist for this product",
      );

    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountedPrice = productData.price - discountAmount;
    const subtotal = discountedPrice * quantity;

    const existingCart = await cartSchema.findOne({ user: req.user._id });

    if (existingCart) {
      const alreadyExists = existingCart.items.some(
        (pItem) => pItem.sku === sku,
      );
      if (alreadyExists)
        return responseHandler.error(res, 400, "Product already exist in cart");

      existingCart.items.push({
        product: productId,
        sku,
        quantity,
        subtotal,
      });
      existingCart.totalItems = existingCart.items.length;
      await existingCart.save();
      await existingCart.populate("items.product", "title price thumbnail");
      return responseHandler.success(
        res,
        201,
        existingCart,
        "Product added to cart.",
      );
    } else {
      const newCart = await cartSchema.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            sku,
            quantity,
            subtotal,
          },
        ],
        totalItems: 1,
      });
      await newCart.populate("items.product", "title price thumbnail");
      return responseHandler.success(
        res,
        201,
        newCart,
        "Product added to cart.",
      );
    }
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 500, "Server Error");
  }
};

const getUserCart = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({ user: req.user._id })
      .select("-user")
      .populate("items.product", "title price thumbnail");
    if (!cart) return responseHandler.success(res, 200, null, "Cart is empty");
    return responseHandler.success(res, 200, cart, "Cart fetched successfully");
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 500, "Server Error");
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, itemId, quantity } = req.body;

    if (!itemId || typeof quantity !== "number")
      return responseHandler.error(res, 400, "Invalid Request");

    if (quantity < 1)
      return responseHandler.error(res, 400, "Keep minimum 1 item");

    if (!isValidId([itemId]))
      return responseHandler.error(res, 400, "Invalid Request");

    const cart = await cartSchema.findOne({
      user: req.user._id,
      "items._id": itemId,
    });
    if (!cart) return responseHandler.error(res, 400, "Cart item not found");

    const cartItem = cart.items.id(itemId);
    if (!cartItem)
      return responseHandler.error(res, 400, "Cart item not found");

    const productToUse = cartItem.product?._id || cartItem.product || productId;
    if (!productToUse || !isValidId([productToUse]))
      return responseHandler.error(res, 400, "Invalid Request");

    const productData = await productSchema.findById(productToUse);
    if (!productData)
      return responseHandler.error(res, 400, "Product not found");

    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountedPrice = productData.price - discountAmount;
    const subtotal = discountedPrice * quantity;

    cartItem.quantity = quantity;
    cartItem.subtotal = subtotal;
    cart.totalItems = cart.items.length;

    await cart.save();
    await cart.populate("items.product", "title price thumbnail");

    return responseHandler.success(res, 200, cart, "Cart Updated");
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 500, "Server Error");
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!isValidId([itemId]))
      return responseHandler.error(res, 400, "Invalid Request");

    if (!itemId) return responseHandler.error(res, 400, "Invalid Request");

    const cart = await cartSchema
      .findOneAndUpdate(
        { user: req.user._id, "items._id": itemId },
        {
          $pull: {
            items: { _id: itemId },
          },
        },
        { new: true },
      )
      .select("items totalItems")
      .populate("items.product", "title price thumbnail");

    if (!cart) return responseHandler.error(res, 400, "Cart item not found");

    cart.totalItems = cart.items.length;
    await cart.save();

    return responseHandler.success(res, 200, cart, "Cart Updated");
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 500, "Server Error");
  }
};

module.exports = { addToCart, getUserCart, updateCart, removeFromCart };
