import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/supabase/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Order ID", "Date", "Status", "Payment", "Total"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3"><p className="text-sm font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p></td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>{order.status}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{order.payment_status}</span></td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No orders yet.</p>}
      </div>
    </div>
  );
}
