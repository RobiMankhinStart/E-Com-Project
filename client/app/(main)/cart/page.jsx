"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "@/app/lib/cartClient";

const Page = () => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCartItems()
      .then(({ items: loadedItems, cartId: loadedCartId }) => {
        if (!mounted) return;
        setItems(loadedItems || []);
        setCartId(loadedCartId || null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    window.dispatchEvent(new Event("curator_cart_updated"));
  }, [items, isLoading]);

  const updateQuantity = async (id, delta) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const quantity = Math.max(1, item.quantity + delta);
    const { items: updatedItems } = await updateCartItem({
      itemId: item.itemId || id,
      productId: item.productId,
      quantity,
    });
    setItems(updatedItems);
  };

  const removeItem = async (id) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const { items: updatedItems } = await removeCartItem({
      itemId: item.itemId || id,
    });
    setItems(updatedItems);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-[#f7f9fb] pt-20 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-4"
          >
            Your Selection
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-xl font-medium">
            Refine your collection before proceeding to our secure checkout.
            Each piece is curated for lasting impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 transition-all hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative w-full md:w-40 aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 flex flex-col justify-between w-full py-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
                          {item.sku}
                        </p>
                        <p className="text-indigo-600 text-sm font-bold mt-1">
                          {item.variant}
                        </p>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-6">
                      {/* Quantity Toggles */}
                      <div className="flex items-center bg-slate-50 rounded-full px-3 py-1.5 border border-slate-100">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-indigo-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="mx-4 font-black text-slate-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-indigo-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                <ShoppingBag
                  className="mx-auto text-slate-200 mb-4"
                  size={48}
                />
                <p className="text-slate-500 font-bold">
                  Your selection is currently empty.
                </p>
              </div>
            )}
          </div>

          {/* Cart Summary Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tighter">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-bold text-slate-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Shipping
                  </span>
                  <span className="font-bold text-green-600 uppercase text-xs">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Est. Tax
                  </span>
                  <span className="font-bold text-slate-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-end">
                  <span className="text-lg font-black text-slate-900">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-indigo-600 tracking-tighter">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/checkout`}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-indigo-600 active:scale-[0.98] shadow-lg shadow-indigo-100"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>
              {items.length === 0 && (
                <button
                  disabled
                  className="mt-4 w-full bg-slate-200 text-slate-500 font-black py-5 rounded-2xl flex items-center justify-center gap-3 cursor-not-allowed"
                >
                  Add items to checkout
                </button>
              )}

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Complimentary Shipping
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      On all orders over $500.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Secure Guarantee
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Authenticity verified by Curator Cloud.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-slate-900 p-6 rounded-[24px]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="ENTER CODE"
                  type="text"
                />
                <button className="px-6 py-3 bg-white text-slate-900 text-xs font-black rounded-xl hover:bg-indigo-500 hover:text-white transition-all">
                  APPLY
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Page;
