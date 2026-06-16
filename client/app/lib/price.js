export function getDiscountedPrice(product) {
  const discount = Number(product.discountPercentage || 0);
  const amount = product.price - product.price * (discount / 100);
  return Number(amount.toFixed(2));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}
