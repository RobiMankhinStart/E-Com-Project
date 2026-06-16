"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  RotateCcw,
  Box,
  Layers,
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

import {
  useGetCategoriesQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/app/(admin)/services/api";
import AdminPageHeader from "@/app/components/admin/adminPageHeader";

const SIZE_OPTIONS = ["s", "m", "l", "xl", "2xl", "3xl"];

export default function UpdateProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: categoriesData } = useGetCategoriesQuery();
  const {
    data: productResponse,
    isLoading,
    error,
  } = useGetSingleProductQuery({ slug, admin: "true" });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const product = productResponse?.data;
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    description: "",
    tags: "",
    variants: [],
    isActive: false,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [destroyImages, setDestroyImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        slug: product.slug || "",
        category: product.category?._id || product.category || "",
        price: product.price || 0,
        discountPercentage: product.discountPercentage || 0,
        description: product.description || "",
        tags: Array.isArray(product.tags)
          ? product.tags.join(", ")
          : product.tags || "",
        variants: Array.isArray(product.variants)
          ? product.variants.map((v) => ({
              sku: v.sku,
              color: v.color,
              size: v.size,
              stock: v.stock,
            }))
          : [],
        isActive: Boolean(product.isActive),
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "discountPercentage"
            ? parseFloat(value)
            : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "stock" ? parseInt(value, 10) || 0 : value,
    };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { sku: "", color: "", size: "", stock: 0 }],
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailFile(file);
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    const currentCount = existingImages.length + newImages.length;
    const maxAllowed = 4 - currentCount;

    if (maxAllowed <= 0) {
      toast.error(
        "You already have 4 gallery images. Remove one before adding more.",
      );
      return;
    }

    if (files.length > maxAllowed) {
      toast.error(
        `Only ${maxAllowed} more image(s) can be added. Maximum is 4.`,
      );
      setNewImages((prev) => [...prev, ...files.slice(0, maxAllowed)]);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setDestroyImages((prev) => [...prev, url]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.slug ||
      !formData.category ||
      formData.price <= 0 ||
      formData.variants.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("slug", formData.slug);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("price", String(formData.price));
      payload.append("discountPercentage", String(formData.discountPercentage));
      payload.append("tags", formData.tags);
      payload.append("isActive", String(formData.isActive));
      payload.append("variants", JSON.stringify(formData.variants));

      if (thumbnailFile) {
        payload.append("thumbnail", thumbnailFile);
      }
      newImages.forEach((file) => payload.append("images", file));
      destroyImages.forEach((url) => payload.append("destroyImages", url));

      const result = await updateProduct({
        slug,
        data: payload,
      }).unwrap();

      toast.success(result.message || "Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  if (isLoading)
    return (
      <div className="p-10 font-bold animate-pulse text-slate-400">
        Loading Product Data...
      </div>
    );

  if (error)
    return (
      <div className="p-10 font-bold text-rose-500">
        Failed to load product data.
      </div>
    );

  if (!product)
    return (
      <div className="p-10 font-bold text-rose-500">Product not found.</div>
    );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <AdminPageHeader
          title="Update Product"
          description={`Refining details for: ${product.title}`}
        />
      </div>

      <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm max-w-6xl mx-auto">
        <form className="grid gap-8 md:grid-cols-2" onSubmit={handleSubmit}>
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

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="streetwear, summer, sale"
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Active Product
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-bold text-slate-700">Thumbnail</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative h-40 overflow-hidden rounded-3xl bg-slate-100">
                    <Image
                      src={
                        thumbnailFile
                          ? URL.createObjectURL(thumbnailFile)
                          : product.thumbnail || "/placeholder-image.jpg"
                      }
                      alt="Product thumbnail"
                      fill
                      className="object-cover"
                      sizes="100vw"
                      unoptimized
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="text-sm text-slate-500"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-bold text-slate-700">
                      Gallery Images
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {existingImages.length} existing image(s),{" "}
                    {newImages.length} new file(s). Maximum 4 gallery images
                    total.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((url) => (
                    <div
                      key={url}
                      className="relative overflow-hidden rounded-3xl bg-white border border-slate-200"
                    >
                      <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700 shadow-sm">
                        Existing
                      </div>
                      <Image
                        src={url}
                        alt="Existing product image"
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-rose-500 shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {newImages.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-3xl bg-white border border-slate-200"
                    >
                      <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700 shadow-sm">
                        New
                      </div>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="New image preview"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-rose-500 shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="flex min-h-[8rem] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-100 p-4 text-center text-slate-500 transition hover:border-indigo-500 hover:text-indigo-700">
                    <span className="text-sm font-semibold">Upload images</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {4 - (existingImages.length + newImages.length)} image(s)
                      left.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleNewImages}
                      disabled={existingImages.length + newImages.length >= 4}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">
                  Inventory & Variants
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
              >
                Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-[24px] border border-slate-100 bg-slate-50/50 p-6 sm:grid-cols-5 items-end"
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
                    <select
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                      className="w-full bg-white rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm"
                    >
                      <option value="">Select</option>
                      {SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Stock
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
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 pt-8 border-t border-slate-50 sm:flex-row sm:items-center sm:justify-between">
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
    </div>
  );
}
