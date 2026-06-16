"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDeleteProductMutation } from "@/app/(admin)/services/api";

export default function ProductDeleteButton({ productId }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully!");
      setShowConfirm(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-rose-100"
      >
        <Trash2 size={14} />
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Delete Product?
            </h3>
            <p className="text-sm text-slate-600 mb-8">
              This action cannot be undone. The product and all associated
              images will be permanently deleted.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
