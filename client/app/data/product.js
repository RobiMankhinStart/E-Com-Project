import { categories } from "./categories";

const [streetwear, athleisure, outerwear, footwear] = categories;

export const products = [
  {
    title: "Pulse Oversized Hoodie",
    slug: "pulse-oversized-hoodie",
    description:
      "Heavyweight fleece hoodie with dropped shoulders and a brushed interior.",
    category: streetwear._id,
    price: 89,
    discountPercentage: 15,
    variants: [
      { sku: "POH-BLK-M", color: "Black", size: "m", stock: 15 },
      { sku: "POH-BLK-L", color: "Black", size: "l", stock: 12 },
      { sku: "POH-SND-XL", color: "Sand", size: "xl", stock: 9 },
    ],
    tags: ["hoodie", "winter", "street"],
    thumbnail:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Stride Cargo Joggers",
    slug: "stride-cargo-joggers",
    description:
      "Tapered fit joggers with utility pockets and stretch waistband.",
    category: athleisure._id,
    price: 72,
    discountPercentage: 10,
    variants: [
      { sku: "SCJ-OLV-S", color: "Olive", size: "s", stock: 18 },
      { sku: "SCJ-OLV-M", color: "Olive", size: "m", stock: 22 },
      { sku: "SCJ-CHR-L", color: "Charcoal", size: "l", stock: 14 },
    ],
    tags: ["joggers", "training", "daily"],
    thumbnail:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617952385804-7f8f8f0cde4f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Northline Puffer Jacket",
    slug: "northline-puffer-jacket",
    description:
      "Quilted puffer jacket with windproof shell and insulated core.",
    category: outerwear._id,
    price: 148,
    discountPercentage: 20,
    variants: [
      { sku: "NPJ-NVY-M", color: "Navy", size: "m", stock: 10 },
      { sku: "NPJ-NVY-L", color: "Navy", size: "l", stock: 8 },
      { sku: "NPJ-STN-XL", color: "Stone", size: "xl", stock: 6 },
    ],
    tags: ["jacket", "outerwear", "cold"],
    thumbnail:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Flux Knit Runner",
    slug: "flux-knit-runner",
    description:
      "Breathable knit sneakers with responsive foam for all-day comfort.",
    category: footwear._id,
    price: 96,
    discountPercentage: 5,
    variants: [
      { sku: "FKR-WHT-9", color: "White", size: "m", stock: 24 },
      { sku: "FKR-WHT-10", color: "White", size: "l", stock: 19 },
      { sku: "FKR-BLK-11", color: "Black", size: "xl", stock: 16 },
    ],
    tags: ["sneakers", "running", "lightweight"],
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Monochrome Overshirt",
    slug: "monochrome-overshirt",
    description: "Structured overshirt crafted from durable cotton twill.",
    category: outerwear._id,
    price: 84,
    discountPercentage: 0,
    variants: [
      { sku: "MOS-GRY-M", color: "Grey", size: "m", stock: 12 },
      { sku: "MOS-GRY-L", color: "Grey", size: "l", stock: 11 },
      { sku: "MOS-BLK-XL", color: "Black", size: "xl", stock: 9 },
    ],
    tags: ["overshirt", "layering", "minimal"],
    thumbnail:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Aero Compression Tee",
    slug: "aero-compression-tee",
    description:
      "Fast-dry compression tee with flexible seams and body contour fit.",
    category: athleisure._id,
    price: 42,
    discountPercentage: 8,
    variants: [
      { sku: "ACT-BLU-S", color: "Blue", size: "s", stock: 32 },
      { sku: "ACT-BLU-M", color: "Blue", size: "m", stock: 29 },
      { sku: "ACT-WHT-L", color: "White", size: "l", stock: 21 },
    ],
    tags: ["tee", "gym", "performance"],
    thumbnail:
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(limit = 4) {
  return products.slice(0, limit);
}

export function getProductsByCategory(categoryId) {
  return products.filter((product) => product.category === categoryId);
}
