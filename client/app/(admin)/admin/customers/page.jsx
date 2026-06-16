import React from "react";
import { Search, MoreVertical, Users, UserCheck, Star } from "lucide-react";

export default function CustomersPage() {
  const stats = [
    {
      label: "Total Customers",
      value: "8,241",
      trend: "+124 this week",
      color: "text-indigo-600",
    },
    {
      label: "Active Now",
      value: "342",
      trend: "Browsing site",
      color: "text-emerald-600",
    },
    {
      label: "Repeat Rate",
      value: "42%",
      trend: "+2% vs last month",
      color: "text-indigo-600",
    },
    {
      label: "Top Tier",
      value: "154",
      trend: "VIP Status",
      color: "text-amber-500",
    },
  ];

  const customers = [
    {
      id: 1,
      name: "Elena Vance",
      email: "elena@vance.com",
      orders: "12 orders",
      spent: "$4,200",
      joinDate: "Jan 2023",
    },
    {
      id: 2,
      name: "Mark Scout",
      email: "mark.s@lumon.com",
      orders: "2 orders",
      spent: "$150",
      joinDate: "March 2023",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
            Customers
          </h2>
          <p className="text-slate-500 font-medium">
            Insights into your audience and shopping behavior.
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
        <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-indigo-500/20 text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Orders
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Join Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">
                    {user.orders}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">
                    {user.spent}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-400">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-5">
                    <button className="p-2 text-slate-400 hover:text-indigo-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
