"use client";
import React from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the chart
const data = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];
export default function DashboardPage() {
  const kpiCards = [
    {
      label: "Revenue",
      value: "$84,240",
      trend: "+12.5%",
      icon: <TrendingUp size={20} />,
    },
    {
      label: "Customers",
      value: "1,208",
      trend: "+8.2%",
      icon: <Users size={20} />,
    },
    {
      label: "Orders",
      value: "342",
      trend: "+15.1%",
      icon: <ShoppingBag size={20} />,
    },
    {
      label: "Stock Alerts",
      value: "24",
      trend: "-2.0%",
      icon: <Package size={20} />,
    },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
          Overview
        </h2>
        <p className="text-slate-500 font-medium">
          Welcome back, Robiul. Here is what is happening today.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                {card.icon}
              </div>
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                {card.trend} <ArrowUpRight size={14} />
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {card.label}
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Visualizer */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Sales Performance
        </h3>

        {/* ResponsiveContainer makes the chart grow/shrink with the card */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-4 text-sm font-medium text-slate-600">
            <p>• New order #ORD-7722 placed by Elena V.</p>
            <p>• Product "Studio Wireless X" restocked.</p>
            <p>• Category "Minimalist Tech" updated.</p>
          </div>
        </div>
        <div className="bg-linear-to-br from-indigo-700 to-indigo-500 p-6 rounded-[24px] text-white">
          <h4 className="font-bold mb-2">Need Help?</h4>
          <p className="text-indigo-100 text-sm mb-4">
            Check out our documentation for advanced analytics and API settings.
          </p>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
}
