"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AdminSideNavbar from "../components/admin/AdminSideNavbar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not authenticated or not admin after loading is complete
    if (!loading) {
      const isAdmin = ["admin", "editor"].includes(user?.role);
      if (!user || !isAdmin) {
        router.push("/signin");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If authenticated and is admin/editor, show admin layout
  const isAdmin = ["admin", "editor"].includes(user?.role);
  if (user && isAdmin) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <AdminSideNavbar />
        <main className="flex-1 ml-64 p-10">{children}</main>
      </div>
    );
  }

  // If not authorized, show nothing (redirect will happen in useEffect)
  return null;
}
