"use client";
import Link from "next/link";

import Image from "next/image";
import AdminPageHeader from "@/app/components/admin/adminPageHeader";
import { useGetCategoriesQuery } from "../../services/api";

// For now, placeholder logic for the count.
const productsPlaceholder = [];

export default function CategoriesListPage() {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();

  if (isError)
    return (
      <div className="flex h-96 items-center justify-center text-rose-500 font-bold">
        Failed to load categories. Please check your server connection.
      </div>
    );

  return (
    <div className="animate-in fade-in duration-700">
      <AdminPageHeader
        title="Category List"
        description="Manage category structure and catalog grouping."
        action={
          <Link
            href="/admin/categories/new"
            className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Create Category
          </Link>
        }
      />

      {/* Loading Skeleton State */}
      {isLoading ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-10">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-3xl bg-slate-100 animate-pulse"
            />
          ))}
        </section>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-10">
          {data?.data?.map((category) => {
            // Logic for counting products in this category
            const count = productsPlaceholder.filter(
              (p) => p.category === category._id,
            ).length;

            return (
              <article
                key={category._id}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative  rounded-lg  h-48 w-full bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
                  {/* Background Decorative Gradient */}
                  <div className="  border-black p-2 inset-0 bg-linear-to-br from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <Image
                    width={300}
                    height={300}
                    src={category.thumbnail}
                    alt={category.name}
                    className=" absolute z-10 rounded-lg  object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="space-y-2 p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 capitalize">
                      {category.name}
                    </h3>
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-10">
                    {category.description ||
                      "No description provided for this category."}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {count} Products
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Empty State */}
      {!isLoading && data?.data?.length === 0 && (
        <div className="mt-20 text-center space-y-4">
          <p className="text-slate-400 font-medium">
            No categories found in the database.
          </p>
          <Link
            href="/admin/categories/new"
            className="text-indigo-600 font-bold underline"
          >
            Add your first category
          </Link>
        </div>
      )}
    </div>
  );
}
