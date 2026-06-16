"use client";
import React, { useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  ShoppingBag,
  CreditCard,
  Clock,
} from "lucide-react";
import { useGetOrdersQuery } from "../../services/api";

export default function OrdersPage() {
  const { data, isLoading, error } = useGetOrdersQuery();

  // Debug logging
  useEffect(() => {
    console.log("=== ORDERS PAGE DEBUG ===");
    console.log("isLoading:", isLoading);
    console.log("data:", data);
    console.log("error:", error);
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log("Cookies present:", document.cookie ? "Yes" : "No");
    console.log("Full cookies:", document.cookie);
  }, [data, isLoading, error]);

  // Extract orders from the response - handle different response structures
  const orders = Array.isArray(data?.data?.orders)
    ? data.data.orders
    : Array.isArray(data?.orders)
      ? data.orders
      : [];

  const stats = [
    {
      label: "Total Orders",
      value: orders.length.toString(),
      trend: "Updated live",
      color: "text-indigo-600",
    },
    {
      label: "Paid Orders",
      value: orders
        .filter((order) => order.payment?.status === "paid")
        .length.toString(),
      trend: "Revenue secured",
      color: "text-emerald-600",
    },
    {
      label: "Pending Payment",
      value: orders
        .filter((order) => order.payment?.status !== "paid")
        .length.toString(),
      trend: "Action required",
      color: "text-orange-600",
    },
    {
      label: "Total Revenue",
      value: orders
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      trend: "Aggregate order value",
      color: "text-indigo-600",
    },
  ];

  // Create table data from orders
  const ordersData = orders.map((order) => ({
    id: order.orderNumber,
    customer: order.user?.fullName || order.user?.email || "Guest",
    date: new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    total:
      order.totalPrice?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }) || "$0.00",
    status: order.payment?.status === "paid" ? "Paid" : "Pending",
  }));

  return (
    <div className="animate-in fade-in duration-500">
      {/* Debug Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs">
        <p className="font-bold text-blue-900 mb-2">Debug Info:</p>
        <p>API Base: {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
        <p>Has Cookies: {document.cookie ? "✓ Yes" : "✗ No"}</p>
        <p>Loading: {isLoading ? "Yes" : "No"}</p>
        <p>Has Error: {error ? "Yes" : "No"}</p>
        <p>Data Count: {orders.length}</p>
      </div>

      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
            Orders
          </h2>
          <p className="text-slate-500 font-medium">
            Track and manage customer transactions.
          </p>
        </div>
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

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search order ID or customer..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-indigo-500/20 text-sm font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Total
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-rose-500">
                      <p className="font-bold mb-2">Failed to load orders</p>
                      <p className="text-sm mb-3">
                        {error?.data?.message ||
                          error?.message ||
                          "Unknown error"}
                      </p>
                      <details className="text-left text-xs bg-rose-50 p-2 rounded border border-rose-200 max-w-md mx-auto">
                        <summary className="cursor-pointer font-bold">
                          Debug Info
                        </summary>
                        <pre className="mt-2 overflow-auto text-rose-700">
                          {JSON.stringify(error, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                ordersData.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5 font-black text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">
                      {order.customer}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-400">
                      {order.date}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          order.status === "Paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
