"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit3, Package, Layers, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../services/api";
import AdminPageHeader from "@/app/components/admin/adminPageHeader";
import { formatCurrency, getDiscountedPrice } from "@/app/lib/price";
import ProductDeleteButton from "@/app/components/admin/ProductDeleteButton";

export default function AdminProductsPage() {
  const { data, isLoading, error } = useGetProductsQuery({ admin: "true" });
  const productsList = data?.data?.products || [];

  return (
    <div className="animate-in fade-in duration-500">
      <AdminPageHeader
        title="Product List"
        description="Browse and manage your curated catalog, inventory levels, and pricing."
        action={
          <Link
            href="/admin/products/new"
            className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            Create New Product
          </Link>
        }
      />

      <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mt-10 mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Stock
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-10 bg-slate-50/30">
                      <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-rose-500">
                      <AlertCircle size={24} />
                      <span className="font-bold text-sm">
                        Failed to load catalog.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : productsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 font-medium text-sm"
                  >
                    No products found in the catalog.
                  </td>
                </tr>
              ) : (
                productsList.map((product) => {
                  const totalStock =
                    product.variants?.reduce(
                      (sum, variant) => sum + (variant.stock || 0),
                      0,
                    ) || 0;

                  return (
                    <tr
                      key={product._id || product.slug}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                            <Image
                              src={
                                product?.thumbnail ||
                                product?.images?.[0] ||
                                "/placeholder-image.jpg"
                              }
                              fill
                              alt={product.title || "Product image"}
                              className="object-cover"
                              sizes="56px"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {product.title}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-slate-300" />
                          <span className="text-xs font-bold text-slate-600 capitalize">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">
                            {formatCurrency(getDiscountedPrice(product))}
                          </span>
                          {product.discountPercentage > 0 && (
                            <span className="text-[10px] font-bold text-slate-400 line-through">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${totalStock > 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                          />
                          <span
                            className={`text-sm font-bold ${totalStock > 0 ? "text-slate-700" : "text-rose-500"}`}
                          >
                            {totalStock}{" "}
                            <span className="text-[10px] text-slate-400 font-normal">
                              units
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.slug}/edit`}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-orange-100"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>
                          <ProductDeleteButton productId={product._id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
            <Package size={14} />
            Total Items: {productsList.length}
          </span>
        </div>
      </section>
    </div>
  );
}
