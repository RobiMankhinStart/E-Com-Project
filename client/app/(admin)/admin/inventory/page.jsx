import React from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";

export default function InventoryPage() {
  const stats = [
    {
      label: "Total Products",
      value: "1,284",
      trend: "+12% this month",
      color: "text-indigo-600",
    },
    {
      label: "Active Listings",
      value: "942",
      trend: "73% coverage",
      color: "text-emerald-600",
    },
    {
      label: "Out of Stock",
      value: "18",
      trend: "Needs attention",
      color: "text-rose-600",
    },
    {
      label: "Avg. Margin",
      value: "34.2%",
      trend: "+2.4% vs LY",
      color: "text-indigo-600",
    },
  ];

  const products = [
    {
      id: 1,
      title: "Linear Watch v2",
      sku: "LNR-W-002",
      category: "Accessories",
      price: "$240.00",
      stock: "142 units",
      status: "Active",
    },
    {
      id: 2,
      title: "Rush Runner Pro",
      sku: "RSH-R-881",
      category: "Footwear",
      price: "$120.00",
      stock: "24 units",
      status: "Low Stock",
    },
    {
      id: 3,
      title: "Studio Wireless X",
      sku: "SND-W-019",
      category: "Electronics",
      price: "$399.00",
      stock: "0 units",
      status: "Out of Stock",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
            Inventory
          </h2>
          <p className="text-slate-500 font-medium">
            Manage your curated product collection and availability.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Plus size={20} />
          Create New Product
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-slate-900 mb-2">
              {stat.value}
            </p>
            <p className={`text-xs font-bold ${stat.color}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-12">
        {/* Search & Filter */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-indigo-500/20 text-sm font-medium outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Stock
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <Image
                          fill
                          src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100&auto=format&fit=crop`}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {product.title}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        product.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : product.status === "Low Stock"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
            Showing 1 to 3 of 1,284 products
          </span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-indigo-100">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all text-xs font-bold">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all text-xs font-bold">
              3
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
