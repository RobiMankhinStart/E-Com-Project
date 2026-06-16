"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, Box, Layers } from "lucide-react";
import { toast } from "react-hot-toast";

import { categories } from "@/app/data/categories";
import { useUpdateProductMutation } from "@/app/(admin)/services/api";

export default function ProductEditForm({ product }) {
  const router = useRouter();
  const [updateProductMutation, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    description: "",
    variants: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        slug: product.slug,
        category: product.category?._id || product.category,
        price: product.price,
        discountPercentage: product.discountPercentage,
        description: product.description,
        variants: product.variants.map((v) => ({
          sku: v.sku,
          color: v.color,
          size: v.size,
          stock: v.stock,
        })),
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discountPercentage"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "stock" ? parseInt(value) : value,
    };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.slug ||
      !formData.category ||
      formData.price <= 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const result = await updateProductMutation({
        slug: product.slug,
        data: formData,
      }).unwrap();
      toast.success(result.message || "Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  return (
    <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm max-w-5xl">
      <form className="grid gap-8 md:grid-cols-2" onSubmit={handleSubmit}>
        {/* Header Section */}
        <div className="md:col-span-2 flex items-center gap-3 border-b border-slate-50 pb-4">
          <Box size={20} className="text-indigo-600" />
          <h2 className="text-lg font-black text-slate-900">Core Identity</h2>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Slug
          </label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Base Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Discount %
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleInputChange}
            className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Editorial Description
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-slate-50 rounded-[24px] border-none p-5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/10"
          />
        </div>

        {/* Variants Management */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <Layers size={20} className="text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              Inventory & Variants
            </h2>
          </div>
          <div className="space-y-3">
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-[24px] border border-slate-100 bg-slate-50/50 p-6 sm:grid-cols-4 items-end"
              >
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    SKU
                  </p>
                  <input
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                    className="w-full bg-white rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Color
                  </p>
                  <input
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(index, "color", e.target.value)
                    }
                    className="w-full bg-white rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Size
                  </p>
                  <input
                    value={variant.size?.toUpperCase() || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "size", e.target.value)
                    }
                    className="w-full bg-white rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    In Stock
                  </p>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
                    }
                    className="w-full bg-white rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex items-center gap-4 pt-8 border-t border-slate-50">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            <Save size={20} />
            {isUpdating ? "Updating..." : "Update changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <RotateCcw size={20} />
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
