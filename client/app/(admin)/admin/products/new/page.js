"use client";

import React, { useState } from "react";
import {
  Save,
  X,
  Image as ImageIcon,
  Box,
  Tag,
  Plus,
  Trash2,
  Layers,
  Percent,
  DollarSign,
} from "lucide-react";

import { toast } from "sonner";
import Image from "next/image";
import {
  useCreateNewProductMutation,
  useGetCategoriesQuery,
} from "@/app/(admin)/services/api";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/app/lib/utils"; // Adjusted path to your project structure
import AdminPageHeader from "@/app/components/admin/adminPageHeader";

export default function CreateProductPage() {
  // --- API HOOKS ---
  const [createNewProduct, { isLoading }] = useCreateNewProductMutation();
  const { data: categoryList } = useGetCategoriesQuery();
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  // Using 'varients' to match your specific naming convention
  const [varients, setVarients] = useState([
    {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      // eslint-disable-next-line react-hooks/purity
      sku: `NM-${Math.floor(Math.random() * 100000)}`,
      color: "",
      size: "",
      stock: "",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    tags: "",
    thumbnail: null,
    images: [],
  });

  // --- VARIANT LOGIC ---
  const handleAddNewVarient = () => {
    setVarients((prev) => [
      ...prev,
      {
        id: Date.now(),
        sku: `NM-${Math.floor(Math.random() * 100000)}`,
        color: "",
        size: "",
        stock: "",
      },
    ]);
  };

  const handleCancelVarient = (id) => {
    if (varients.length > 1) {
      setVarients((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error("You must have at least one variant.");
    }
  };

  const handleInputVarient = (id, field, value) => {
    setVarients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // --- IMAGE LOGIC ---
  const handleInputImages = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveInputImages = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  // --- SUBMIT LOGIC (BACKEND SYNC) ---
  const handleUploadNewProduct = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Uploading product to catalog...");

    const formData = new FormData();

    // 1. Append standard text fields
    formData.append("title", newProduct.title);
    formData.append("slug", newProduct.slug);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("price", newProduct.price);
    formData.append("discountPercentage", newProduct.discountPercentage);
    formData.append("tags", newProduct.tags);

    // 2. Append Images (Backend receives an array under 'images')
    newProduct.images.forEach((file) => {
      formData.append("images", file);
    });

    // 3. Append Thumbnail
    if (newProduct.thumbnail) {
      formData.append("thumbnail", newProduct.thumbnail);
    }

    // 4. Append Variants (Stringified for backend parsing)
    // Sent as 'variants' to match standard backend naming
    formData.append("variants", JSON.stringify(varients));
    formData.append("isActive", "true");

    try {
      const res = await createNewProduct(formData).unwrap();
      toast.success(res?.message || "Product created successfully!", {
        id: toastId,
      });
      // Reset form inputs
      setNewProduct({
        title: "",
        slug: "",
        description: "",
        category: "",
        price: 0,
        discountPercentage: 0,
        tags: "",
        thumbnail: null,
        images: [],
      });
      setVarients([
        {
          id: Date.now(),
          sku: `NM-${Math.floor(Math.random() * 100000)}`,
          color: "",
          size: "",
          stock: "",
        },
      ]);

      // Redirect admin to products list
      router.push("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <AdminPageHeader
        title="Create New Product"
        description="Fill in the details below to add a new item to your store."
      />

      <form
        onSubmit={handleUploadNewProduct}
        className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-3"
      >
        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: General Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <Layers className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">General Information</h3>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Product Title
                </label>
                <input
                  required
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => {
                    setNewProduct({
                      ...newProduct,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="e.g. Premium Cotton Hoodie"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Slug (Auto-generated)
                </label>
                <input
                  readOnly
                  type="text"
                  value={newProduct.slug}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Tell customers about this product's features and materials..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>
            </div>
          </section>

          {/* Section: Variants & Inventory */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <Box className="h-5 w-5" />
                <h3 className="font-bold tracking-tight">
                  Inventory & Variants
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddNewVarient}
                className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-hover hover:bg-indigo-600"
              >
                <Plus className="h-3.5 w-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {varients.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-5 md:items-end"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      SKU
                    </label>
                    <input
                      value={v.sku}
                      onChange={(e) =>
                        handleInputVarient(v.id, "sku", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Color
                    </label>
                    <input
                      placeholder="Black"
                      value={v.color}
                      onChange={(e) =>
                        handleInputVarient(v.id, "color", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Size
                    </label>
                    <select
                      value={v.size}
                      onChange={(e) =>
                        handleInputVarient(v.id, "size", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    >
                      <option value="">Size</option>
                      {["xs", "s", "m", "l", "xl", "2xl", "3xl"].map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) =>
                        handleInputVarient(v.id, "stock", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCancelVarient(v.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Media & Pricing */}
        <div className="space-y-8">
          {/* Section: Media Uploads */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <ImageIcon className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Product Media</h3>
            </div>

            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Main Thumbnail
                </label>
                <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 transition-colors">
                  {newProduct.thumbnail ? (
                    <>
                      <Image
                        src={URL.createObjectURL(newProduct.thumbnail)}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewProduct({ ...newProduct, thumbnail: null })
                        }
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-rose-500 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
                      <Plus className="h-6 w-6 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400">
                        UPLOAD THUMBNAIL
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            thumbnail: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Gallery Images
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {newProduct.images.map((file, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="gallery"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInputImages(i)}
                        className="absolute inset-0 flex items-center justify-center bg-rose-500/80 text-white opacity-0 transition-opacity hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <Plus className="h-5 w-5 text-slate-300" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleInputImages}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Category & Pricing */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                required
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="">Select Category</option>
                {categoryList?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id} className="capitalize">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <DollarSign className="h-3.5 w-3.5" /> Price
                </label>
                <input
                  required
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <Percent className="h-3.5 w-3.5" /> Discount
                </label>
                <input
                  type="number"
                  value={newProduct.discountPercentage}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      discountPercentage: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Tag className="h-3.5 w-3.5" /> Tags
              </label>
              <input
                type="text"
                value={newProduct.tags}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, tags: e.target.value })
                }
                placeholder="streetwear, summer, sale"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Publishing..." : "Publish Product"}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}
