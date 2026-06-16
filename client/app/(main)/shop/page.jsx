export const dynamic = "force-dynamic";

import BreadCrumb from "@/app/components/commonUI/BreadCrumb";
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import React from "react";
import ProductCard from "./ProductCard";

const ShopPage = async ({ searchParams }) => {
  const breadcrumbItems = [{ name: "Shop", href: "/shop" }];

  // 1. Unpacking searchParams since it is a Promise in Next.js 15+
  const resolvedSearchParams = await searchParams;

  // 2. Safely reading fields from the unwrapped object
  const search = Array.isArray(resolvedSearchParams?.search)
    ? resolvedSearchParams.search[0]
    : resolvedSearchParams?.search || "";

  const category = Array.isArray(resolvedSearchParams?.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams?.category || "";

  const page =
    parseInt(
      Array.isArray(resolvedSearchParams?.page)
        ? resolvedSearchParams.page[0]
        : resolvedSearchParams?.page,
      10,
    ) || 1;

  // 3. Building API parameters
  const productQuery = new URLSearchParams();
  if (search) productQuery.set("search", search);
  if (category) productQuery.set("category", category);
  if (page) productQuery.set("page", String(page));

  const productUrl = productQuery.toString()
    ? `/product/allproducts?${productQuery.toString()}`
    : "/product/allproducts";

  // 4. Parallel fetch from API
  const [productResponse, categoryResponse] = await Promise.all([
    apiClient.get(productUrl, { revalidate: 60 * 5 }),
    apiClient.get("/category/all", { revalidate: 60 * 60 }),
  ]);

  const productData = productResponse?.data || {};
  const categories = categoryResponse?.data || [];
  const products = productData?.products || [];
  const pagination = productData?.pagination || {};

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen">
      <main className="pt-8 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <BreadCrumb items={breadcrumbItems} />

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="max-w-3xl">
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Our Collection
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              The Seasonal Edit
            </h1>
            <p className="mt-6 text-slate-500 max-w-xl text-lg leading-relaxed font-medium">
              A meticulously curated selection of architectural objects and
              editorial-grade apparel for the modern observer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <form
              method="get"
              className="flex flex-col sm:flex-row items-stretch gap-3 w-full"
            >
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search products..."
                className="min-w-0 flex-1 h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>
            <Link
              href="/shop"
              className="inline-flex w-full justify-center h-12 items-center px-6 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors sm:w-auto"
            >
              Clear
            </Link>
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="mb-8 md:hidden">
          <div className="flex flex-wrap gap-3">
            <Link
              href={
                search
                  ? `/shop?${new URLSearchParams({ search }).toString()}`
                  : "/shop"
              }
              className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                !category
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </Link>
            {categories.map((categoryItem) => (
              <Link
                key={categoryItem._id}
                href={`/shop?${new URLSearchParams({
                  ...(search ? { search } : {}),
                  category: categoryItem.slug,
                }).toString()}`}
                className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                  categoryItem.slug === category
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {categoryItem.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar Filter */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-32 space-y-12">
              <section>
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-8">
                  Categories
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href={
                        search
                          ? `/shop?${new URLSearchParams({ search }).toString()}`
                          : "/shop"
                      }
                      className={`block font-bold text-sm ${
                        !category
                          ? "text-indigo-600"
                          : "text-slate-500 hover:text-indigo-600"
                      }`}
                    >
                      All Items
                    </Link>
                  </li>
                  {categories.map((categoryItem) => (
                    <li key={categoryItem._id}>
                      <Link
                        href={`/shop?${new URLSearchParams({
                          ...(search ? { search } : {}),
                          category: categoryItem.slug,
                        }).toString()}`}
                        className={`block font-bold text-sm ${
                          categoryItem.slug === category
                            ? "text-indigo-600"
                            : "text-slate-500 hover:text-indigo-600"
                        }`}
                      >
                        {categoryItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-8">
                  Price Range
                </h3>
                <div className="px-2">
                  <div className="h-1 w-full bg-slate-200 rounded-full relative">
                    <div className="absolute inset-0 right-1/4 bg-indigo-600 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-sm cursor-pointer"></div>
                    <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-sm cursor-pointer"></div>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>$0</span>
                    <span>$2,500+</span>
                  </div>
                </div>
              </section>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-20 gap-x-12">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full rounded-4xl bg-white p-16 text-center shadow-sm border border-slate-200">
                  <h2 className="text-3xl font-black text-slate-900 mb-4">
                    No products found
                  </h2>
                  <p className="text-slate-500">
                    Try a different search term or clear the filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-32 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(search ? { search } : {}),
                    ...(category ? { category } : {}),
                    page: String(Math.max(1, page - 1)),
                  }).toString()}`}
                  className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                    page <= 1
                      ? "text-slate-300 pointer-events-none"
                      : "text-slate-400 hover:bg-white hover:shadow-md hover:text-indigo-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <div className="flex gap-2 overflow-x-auto">
                  {Array.from({
                    length: Math.max(1, pagination.totalPages || 1),
                  }).map((_, index) => {
                    const num = index + 1;
                    return (
                      <Link
                        key={num}
                        href={`/shop?${new URLSearchParams({
                          ...(search ? { search } : {}),
                          ...(category ? { category } : {}),
                          page: String(num),
                        }).toString()}`}
                        className={`w-12 h-12 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                          num === page
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(search ? { search } : {}),
                    ...(category ? { category } : {}),
                    page: String(
                      Math.min(pagination.totalPages || 1, page + 1),
                    ),
                  }).toString()}`}
                  className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                    page >= (pagination.totalPages || 1)
                      ? "text-slate-300 pointer-events-none"
                      : "text-slate-400 hover:bg-white hover:shadow-md hover:text-indigo-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
              <p className="text-sm text-slate-500">
                Page {page} of {pagination.totalPages || 1}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;
