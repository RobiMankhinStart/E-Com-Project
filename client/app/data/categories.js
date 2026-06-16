export const categories = [
  {
    _id: "cat-streetwear",
    name: "Streetwear",
    slug: "streetwear",
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    description: "Relaxed silhouettes for every day movement.",
  },
  {
    _id: "cat-athleisure",
    name: "Athleisure",
    slug: "athleisure",
    thumbnail:
      "https://images.unsplash.com/photo-1517949908118-721fd86f8e8f?auto=format&fit=crop&w=600&q=80",
    description: "Performance-focused essentials built for comfort.",
  },
  {
    _id: "cat-outerwear",
    name: "Outerwear",
    slug: "outerwear",
    thumbnail:
      "https://images.unsplash.com/photo-1551048632-6f82f7f2f3f0?auto=format&fit=crop&w=600&q=80",
    description: "Layering staples for cool evenings and city weather.",
  },
  {
    _id: "cat-footwear",
    name: "Footwear",
    slug: "footwear",
    thumbnail:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
    description: "Sharp sneakers and clean profiles for all-day wear.",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug);
}
