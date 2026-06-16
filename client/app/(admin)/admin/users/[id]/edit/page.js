import { notFound } from "next/navigation";
import { Save, X, UserCog } from "lucide-react";

import { getAdminUserById } from "@/app/data/admins";
import AdminPageHeader from "@/app/components/admin/adminPageHeader";

export default async function UpdateUserPage({ params }) {
  const routeParams = await params;
  const user = getAdminUserById(routeParams.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <AdminPageHeader
        title="Update User"
        description={`Modify account settings and permissions for ${user.name}`}
      />

      <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <UserCog size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Edit Permissions
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Update profile data and system access levels.
            </p>
          </div>
        </div>

        <form className="grid gap-6 md:grid-cols-2">
          {/* Form Fields */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Full Name
            </label>
            <input
              defaultValue={user.name}
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Email Address
            </label>
            <input
              defaultValue={user.email}
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Phone Number
            </label>
            <input
              defaultValue={user.phone}
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              System Role
            </label>
            <select
              defaultValue={user.role}
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none appearance-none cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Account Status
            </label>
            <select
              defaultValue={user.status}
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none appearance-none cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Joined Date
            </label>
            <input
              defaultValue={user.joinedAt}
              disabled
              className="w-full bg-slate-100 rounded-2xl border-none p-4 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Primary Shipping Address
            </label>
            <input
              defaultValue={user.addresses[0] || ""}
              className="w-full bg-slate-50 rounded-2xl border-none p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center gap-4 pt-6 border-t border-slate-50 mt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Save size={20} />
              Save Changes
            </button>
            <button
              type="button"
              className="bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
