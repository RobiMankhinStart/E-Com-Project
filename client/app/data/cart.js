import { products } from "./product";

const cartBlueprint = [
  { slug: "pulse-oversized-hoodie", sku: "POH-BLK-L", quantity: 1 },
  { slug: "flux-knit-runner", sku: "FKR-WHT-10", quantity: 2 },
];

export const cartItems = cartBlueprint
  .map((entry) => {
    const product = products.find((item) => item.slug === entry.slug);
    if (!product) {
      return null;
    }

    const variant = product.variants.find((item) => item.sku === entry.sku);
    if (!variant) {
      return null;
    }

    return {
      id: `${product.slug}-${variant.sku}`,
      quantity: entry.quantity,
      product,
      variant,
    };
  })
  .filter(Boolean);
