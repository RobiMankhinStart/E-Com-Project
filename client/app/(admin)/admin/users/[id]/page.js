import Link from "next/link";
import { notFound } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit3,
} from "lucide-react";

import AdminPageHeader from "@/app/components/admin/adminPageHeader";
import { adminOrdersWithTotals } from "@/app/data/adminOrders";
import { getAdminUserById } from "@/app/data/admins";
import { formatCurrency } from "@/app/lib/price";

export default async function UserDetailsPage({ params }) {
  const routeParams = await params;
  const user = getAdminUserById(routeParams.id);

  if (!user) {
    notFound();
  }

  const userOrders = adminOrdersWithTotals.filter(
    (order) => order.userId === user.id,
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <AdminPageHeader
        title="User Details"
        description={`Full profile and activity history for ${user.name}`}
        action={
          <Link
            href={`/admin/users/${user.id}/edit`}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Edit3 size={18} />
            Update User
          </Link>
        }
      />

      <section className="grid gap-8 lg:grid-cols-3">
        {/* Profile Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Verify account details and status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <DetailRow
                label="Full Name"
                value={user.name}
                icon={<User size={14} />}
              />
              <DetailRow
                label="Email Address"
                value={user.email}
                icon={<Mail size={14} />}
              />
              <DetailRow
                label="Phone Number"
                value={user.phone || "Not provided"}
                icon={<Phone size={14} />}
              />
              <DetailRow
                label="Joined Date"
                value={user.joinedAt}
                icon={<Calendar size={14} />}
              />

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Account Status
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    user.status === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Access Level
                </p>
                <span className="inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-slate-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Saved Addresses
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((address, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm font-medium text-slate-600"
                  >
                    {address}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order History Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Activity</h2>
                <p className="text-sm text-slate-500 font-medium">
                  Order summary.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Orders
                </p>
                <p className="text-xl font-black text-slate-900">
                  {user.totalOrders}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Spent
                </p>
                <p className="text-xl font-black text-slate-900">
                  {formatCurrency(user.totalSpend)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Recent Orders
              </h3>
              {userOrders.length > 0 ? (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group rounded-2xl border border-slate-100 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-900 text-sm">
                        {order.id}
                      </p>
                      <span className="text-[10px] font-black uppercase text-indigo-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 capitalize">
                      {order.status}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-slate-400">
                    No transactions found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Reusable Small Component for the Profile Grid
function DetailRow({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}
