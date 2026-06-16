export function generateSlug(text) {
  return text
    .toString() // Cast to string (if needed)
    .normalize("NFD") // Split accented characters into base and accent
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters (except hyphens)
    .replace(/--+/g, "-"); // Replace multiple hyphens with a single one
}
