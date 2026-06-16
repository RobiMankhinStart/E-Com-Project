"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { addCartItem } from "@/app/lib/cartClient";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.variants || product.variants.length === 0) {
      toast.error("Product variants not available");
      return;
    }

    setIsAdding(true);
    try {
      const firstVariant = product.variants[0];
      const cartItem = {
        id: `${product._id}-${firstVariant.color}-${firstVariant.size}`,
        productId: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        color: firstVariant.color,
        size: firstVariant.size,
        sku: firstVariant.sku,
        quantity: 1,
      };

      await addCartItem(cartItem);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/shop/${product.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-8/9 overflow-hidden rounded-4xl bg-slate-100 mb-8">
          <Image
            fill
            src={product.thumbnail || "/placeholder-image.jpg"}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />

          {product.tag && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
              {product.tag}
            </div>
          )}

          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="absolute bottom-8 right-8 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-indigo-600 hover:text-white group/btn disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-between items-start px-2">
          <div>
            <h3 className="font-bold text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 tracking-tight">
              {product.title}
            </h3>
            <p className="text-slate-400 text-sm font-semibold tracking-tight">
              {product.description?.slice(0, 90) || "No description available."}
            </p>
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tighter whitespace-nowrap ml-4">
            ${product.price?.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
