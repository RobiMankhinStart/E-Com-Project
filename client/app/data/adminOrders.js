import { getDiscountedPrice } from "../lib/price";
import { products } from "./product";

function createOrderItem(slug, quantity) {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return null;
  }

  return {
    productSlug: product.slug,
    title: product.title,
    quantity,
    unitPrice: getDiscountedPrice(product),
  };
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export const adminOrders = [
  {
    id: "ORD-2026-148",
    userId: "usr-001",
    status: "delivered",
    paymentStatus: "paid",
    createdAt: "2026-03-16",
    shippingAddress: "45 Pine Street, Brooklyn, NY 11201",
    items: [
      createOrderItem("pulse-oversized-hoodie", 1),
      createOrderItem("flux-knit-runner", 1),
    ].filter(Boolean),
  },
  {
    id: "ORD-2026-152",
    userId: "usr-002",
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2026-03-20",
    shippingAddress: "22 Oak Street, Austin, TX 78701",
    items: [
      createOrderItem("northline-puffer-jacket", 1),
      createOrderItem("aero-compression-tee", 2),
    ].filter(Boolean),
  },
  {
    id: "ORD-2026-157",
    userId: "usr-005",
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2026-03-25",
    shippingAddress: "89 Ocean Dr, Miami, FL 33139",
    items: [
      createOrderItem("stride-cargo-joggers", 1),
      createOrderItem("aero-compression-tee", 1),
    ].filter(Boolean),
  },
  {
    id: "ORD-2026-160",
    userId: "usr-001",
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2026-03-28",
    shippingAddress: "890 Market Ave, San Francisco, CA 94105",
    items: [createOrderItem("monochrome-overshirt", 1)].filter(Boolean),
  },
  {
    id: "ORD-2026-164",
    userId: "usr-003",
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2026-04-01",
    shippingAddress: "511 Sunset Blvd, Los Angeles, CA 90028",
    items: [createOrderItem("pulse-oversized-hoodie", 1)].filter(Boolean),
  },
];

export const adminOrdersWithTotals = adminOrders.map((order) => ({
  ...order,
  total: Number(calculateTotal(order.items).toFixed(2)),
}));

export function getOrderById(id) {
  return adminOrdersWithTotals.find((order) => order.id === id);
}
