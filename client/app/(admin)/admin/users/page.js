import Link from "next/link";

import { formatCurrency } from "@/app/lib/price";
import { adminUsers } from "@/app/data/admins";
import AdminPageHeader from "@/app/components/admin/adminPageHeader";
import { MoreVertical, UserCheck, Shield } from "lucide-react";
export default function UsersListPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <AdminPageHeader
        title="User List"
        description="View customer and admin account details, roles, and purchase history."
      />

      <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  User
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Role
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Orders
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Spend
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {adminUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        {user.role === "admin" ? (
                          <Shield size={18} className="text-indigo-600" />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {user.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        user.role === "admin"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                    {user.totalOrders}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">
                    {formatCurrency(user.totalSpend)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        Details
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder to keep the UI consistent with Inventory */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
            Total Members: {adminUsers.length}
          </span>
        </div>
      </section>
    </div>
  );
}
