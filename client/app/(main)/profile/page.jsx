"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/apiClient";
import {
  User,
  Package,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Camera,
  ChevronRight,
  MessageSquare,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const router = useRouter();

  const clearCartStorage = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("curator_cart");
    window.localStorage.removeItem("curator_cart_owner");
    window.dispatchEvent(new Event("curator_cart_updated"));
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/signout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      clearCartStorage();
      router.push("/signin");
    }
  };

  const sidebarLinks = [
    { name: "Profile", icon: <User size={18} /> },
    { name: "My Orders", icon: <Package size={18} /> },
    { name: "Address Book", icon: <BookOpen size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  const recentOrders = [
    {
      id: "CUR-88291",
      name: "Nomad Horizon Watch",
      date: "Nov 12, 2024",
      price: 240.0,
      status: "Delivered",
      statusColor: "bg-green-100 text-green-700",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "CUR-88104",
      name: "Studio Monitor Series 4",
      date: "Oct 28, 2024",
      price: 350.0,
      status: "In Transit",
      statusColor: "bg-indigo-100 text-indigo-700",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    /* 1. Changed to a relative flex container to establish a boundary for the sticky sidebar */
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f7f9fb] relative">
      {/* Sidebar */}
      {/* 2. Switched 'fixed' to 'sticky' and added 'self-start' so it doesn't stretch */}
      <aside className="hidden md:flex w-72 sticky top-0 max-h-screen overflow-y-auto bg-white border-r border-slate-100 p-8 flex-col z-40 self-start">
        <div className="mb-12 pt-2">
          <h1 className="text-xl font-black text-indigo-600 tracking-tighter uppercase">
            Store Dashboard
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">
            RoyalCart
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === link.name
                  ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-black text-xs text-slate-900 truncate w-24">
                  Alexander Chen
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Gold Member
                </p>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            <HelpCircle size={18} />
            Support
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      {/* 3. Removed 'ml-64' as the flexbox handles the spacing naturally now */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl">
        <header className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900"
          >
            Account Overview
          </motion.h2>
          <p className="text-slate-500 mt-3 font-medium text-lg leading-relaxed">
            Manage your preferences and track your latest editorial
            acquisitions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Personal Profile
                </h3>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                  Update Info
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[32px] overflow-hidden ring-8 ring-slate-50 shadow-inner relative">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <div className="flex-1 pt-2">
                  <h4 className="font-black text-slate-900 text-lg">
                    Avatar Image
                  </h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    High resolution JPG or PNG recommended. <br />
                    Max size of 2MB.
                  </p>
                  <button className="mt-5 text-xs font-black text-indigo-600 px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput label="Full Name" defaultValue="Alexander Chen" />
                <FormInput
                  label="Phone Number"
                  defaultValue="+1 (555) 012-3456"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Residential Address
                </label>
                <textarea
                  className="w-full bg-slate-50 border-none rounded-3xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  rows="3"
                  defaultValue="742 Evergreen Terrace, Springfield, OR 97403, United States"
                />
              </div>
              <div className="flex justify-end pt-10">
                <button className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
                  Save Changes
                </button>
              </div>
            </section>

            <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Recent Acquisitions
                </h3>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <LoyaltyCard />
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">
                Quick Support
              </h3>
              <div className="space-y-3">
                <SupportButton
                  icon={<MessageSquare size={16} />}
                  label="Live Concierge Chat"
                />
                <SupportButton
                  icon={<FileText size={16} />}
                  label="Return Policy & Forms"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components for cleaner structure ---

const FormInput = ({ label, defaultValue }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
      type="text"
      defaultValue={defaultValue}
    />
  </div>
);

const OrderItem = ({ order }) => (
  <div className="group flex items-center gap-6 p-4 rounded-[24px] hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
      <Image src={order.image} alt={order.name} fill className="object-cover" />
    </div>
    <div className="flex-1">
      <h4 className="font-black text-base text-slate-900">{order.name}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
        Order #{order.id} • {order.date}
      </p>
      <div className="mt-2">
        <span
          className={`text-[9px] px-2 py-1 font-black rounded-lg uppercase tracking-tighter ${order.statusColor}`}
        >
          {order.status}
        </span>
      </div>
    </div>
    <div className="text-right">
      <p className="font-black text-base text-slate-900">
        ${order.price.toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">1 Item</p>
    </div>
  </div>
);

const LoyaltyCard = () => (
  <div className="bg-indigo-600 text-white rounded-[40px] p-10 relative overflow-hidden shadow-2xl shadow-indigo-200/50">
    <div className="relative z-10">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
        RoyalCart Loyalty
      </span>
      <h3 className="text-4xl font-black mt-2 tracking-tighter">Elite Gold</h3>
      <p className="text-sm mt-5 opacity-90 leading-relaxed font-medium">
        You&apos;ve saved $145.00 in shipping fees this year. Your next
        exclusive drop arrives in 3 days.
      </p>
      <div className="mt-10 pt-10 border-t border-white/10">
        <div className="flex justify-between text-xs font-black mb-4">
          <span className="uppercase tracking-widest">Level Progress</span>
          <span>85%</span>
        </div>
        <div className="w-full h-2.5 bg-white/20 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          />
        </div>
      </div>
    </div>
    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
  </div>
);

const SupportButton = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-5 rounded-[24px] border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-100 transition-all text-left">
    <div className="flex items-center gap-3">
      <div className="text-indigo-600">{icon}</div>
      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
        {label}
      </span>
    </div>
    <ChevronRight size={14} className="text-slate-300" />
  </button>
);

export default CustomerDashboard;
