export const dynamic = "force-dynamic";

import { apiClient } from "@/app/lib/apiClient";
import ProductDetailClient from "./ProductDetailClient";
import Link from "next/link";

const ProductDetailPage = async ({ params }) => {
  // 1. Await params explicitly to guarantee the slug is resolved safely
  const resolvedParams = await params;
  const currentSlug = resolvedParams?.slug;

  if (!currentSlug) {
    console.error(
      "Next.js Error: Slug parameter is missing from the URL track.",
    );
  }

  try {
    // Request to backend product detail endpoint (singular /product)
    const response = await apiClient.get(
      `/product/${currentSlug?.toLowerCase()}`,
      {
        revalidate: 60 * 5,
      },
    );

    const product = response?.data || null;

    if (!product) {
      return <ProductNotFoundUI />;
    }

    return <ProductDetailClient product={product} />;
  } catch (error) {
    console.error("Failed fetching item details profile:", error);
    return <ProductNotFoundUI />;
  }
};

// Extracted UI component to keep file maintainable and clean
function ProductNotFoundUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20">
      <div className="max-w-xl w-full rounded-4xl bg-white p-12 shadow-xl text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          Product not found
        </h1>
        <p className="text-slate-500 mb-8">
          The product you are looking for may have been removed or is no longer
          available.
        </p>
        <Link
          href="/shop"
          className="inline-flex px-6 py-3 rounded-3xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default ProductDetailPage;
