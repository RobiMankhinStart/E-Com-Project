"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
// import { useGetProfileQuery } from "../../services/api";
import {
  LayoutDashboard,
  Store,
  PackageCheck,
  Package,
  ShoppingBag,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  MoreVertical,
} from "lucide-react";
import NavItem from "./NavItem";
import { useGetProfileQuery } from "@/app/(admin)/services/api";

const AdminSideNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery();

  const clearCartStorage = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("curator_cart");
    window.localStorage.removeItem("curator_cart_owner");
    window.dispatchEvent(new Event("curator_cart_updated"));
  };

  const handleLogout = () => {
    // 1. Clear cookies on the client side
    document.cookie =
      "X-AS-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "X-RF-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    clearCartStorage();

    // 2. Safely push them right back to the signin gate
    router.push("/signin");
    router.refresh(); // Refreshes server components to ensure middleware blocks access
  };

  const profile = profileData?.data;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
      <div className="p-6">
        <h1 className="text-xl font-black tracking-tighter text-indigo-600 mb-8">
          Admin Console
        </h1>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
          <div className="w-10 relative h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border-2 border-white shadow-sm">
            {profile?.avatar ? (
              <Image
                fill
                src={profile.avatar}
                alt={profile.fullName || "Admin"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-black">
                {profile?.fullName?.[0] || "A"}
              </span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 truncate">
              {profile?.fullName || profile?.email || "Admin User"}
            </span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
              {profile?.role ? profile.role.toUpperCase() : "Admin"}
            </span>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600">
            <MoreVertical size={14} />
          </button>
        </div>

        <nav className="space-y-1">
          <NavItem
            href="/admin/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname === "/admin/dashboard"}
          />
          <NavItem
            href="/admin/products"
            icon={<Store size={20} />}
            label="Products"
            active={pathname === "/admin/products"}
          />
          <NavItem
            href="/admin/categories"
            icon={<PackageCheck size={20} />}
            label="Categories"
            active={pathname === "/admin/categories"}
          />
          <NavItem
            href="/admin/inventory"
            icon={<Package size={20} />}
            label="Inventory"
            active={pathname === "/admin/inventory"}
          />
          <NavItem
            href="/admin/orders"
            icon={<ShoppingBag size={20} />}
            label="Orders"
            active={pathname === "/admin/orders"}
          />
          <NavItem
            href="/admin/users"
            icon={<Users size={20} />}
            label="Customers"
            active={pathname === "/admin/users"}
          />
          <NavItem
            href="/admin/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={pathname === "/admin/settings"}
          />
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-1">
        <NavItem
          href="/admin/support"
          icon={<HelpCircle size={20} />}
          label="Support"
          active={pathname === "/admin/support"}
        />

        {/* Pass onClick down to NavItem instead of a fixed href link */}
        <NavItem
          onClick={handleLogout}
          icon={<LogOut size={20} />}
          label="Logout"
        />
      </div>
    </aside>
  );
};

export default AdminSideNavbar;
