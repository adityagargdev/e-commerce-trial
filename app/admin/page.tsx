import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/supabase/types";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: products }, { count: orders }, { count: categories }, revenueRes, recentRes] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total").eq("payment_status", "paid"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const revenue = ((revenueRes.data ?? []) as { total: number }[]).reduce((sum, o) => sum + (o.total ?? 0), 0);
  const recentOrders = (recentRes.data ?? []) as Order[];

  const stats = [
    { label: "Total Products", value: products ?? 0, icon: Package, color: "bg-blue-500" },
    { label: "Total Orders", value: orders ?? 0, icon: ShoppingBag, color: "bg-green-500" },
    { label: "Categories", value: categories ?? 0, icon: Tag, color: "bg-purple-500" },
    { label: "Revenue", value: formatPrice(revenue), icon: TrendingUp, color: "bg-amber-500" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={18} className="text-white" /></div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Recent Orders</h2></div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                <span className="font-bold text-gray-900 text-sm">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && <p className="px-6 py-8 text-center text-gray-400 text-sm">No orders yet</p>}
        </div>
      </div>
    </div>
  );
}
