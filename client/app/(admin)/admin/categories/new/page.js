"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminPageHeader from "@/app/components/admin/adminPageHeader";
import { Upload } from "lucide-react";
import { useCreateNewCategoryMutation } from "@/app/(admin)/services/api";
import Image from "next/image";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [createCategory, { isLoading }] = useCreateNewCategoryMutation();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    thumbnail: null,
    description: "",
  });

  // Auto-generating slug from name
  useEffect(() => {
    const generatedSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generatedSlug }));
  }, [formData.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.thumbnail) {
      toast.error("Please fill in all required fields including thumbnail");
      return;
    }

    const toastId = toast.loading("Creating category...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("thumbnail", formData.thumbnail);

      await createCategory(formDataToSend).unwrap();
      toast.success("Category created successfully!", { id: toastId });
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create category", {
        id: toastId,
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminPageHeader
        title="Create Category"
        description="Add a new category for storefront organization."
      />

      <section className="mt-8 rounded-4xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Category Name
            </label>
            <input
              name="name"
              required
              disabled={isLoading}
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 focus:bg-white border-transparent focus:border-indigo-100 disabled:opacity-50"
              placeholder="e.g. Minimalist Tech"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Slug (URL Identifier)
            </label>
            <input
              name="slug"
              required
              disabled={isLoading}
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-slate-50/50 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-400 outline-none cursor-not-allowed disabled:opacity-50"
              placeholder="category-slug"
              readOnly
            />
          </div>

          {/* Thumbnail File Upload Row */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Thumbnail Image *
            </label>

            {/* Flexbox container splits image preview and selection container side-by-side */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              {/* File Drop Input Wrapper */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="file"
                  name="thumbnail"
                  required
                  disabled={isLoading}
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <div className="h-full min-h-[80px] bg-slate-50 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-center gap-3 pointer-events-none">
                  <Upload size={18} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 truncate max-w-xs">
                    {formData.thumbnail?.name || "Click to upload image"}
                  </span>
                </div>
              </div>

              {/* Live Preview Square (Appears next to input) */}
              {thumbnailPreview && (
                <div className="relative w-24 h-24 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                  <Image
                    fill
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="object-cover p-1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              disabled={isLoading}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-50 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 focus:bg-white border-transparent focus:border-indigo-100 disabled:opacity-50"
              placeholder="Describe the aesthetic and purpose of this collection..."
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {isLoading ? "Saving..." : "Save Category"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
