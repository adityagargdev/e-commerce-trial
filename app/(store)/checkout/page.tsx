"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, CreditCard, Plus, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { Address } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string; description: string;
  order_id: string; handler: (r: { razorpay_payment_id: string }) => void;
  prefill?: { name?: string; email?: string }; theme?: { color: string };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [newAddress, setNewAddress] = useState({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

  const subtotal = totalPrice();
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user;
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const { data } = await supabase.from("addresses").select("*").eq("user_id", u.id);
      const addrs = (data ?? []) as Address[];
      setAddresses(addrs);
      const def = addrs.find((a) => a.is_default);
      if (def) setSelectedAddress(def.id);
    }
    load();
  }, [router]);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  async function saveAddress() {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("addresses").insert({ ...newAddress, user_id: user.id }).select().single();
    if (error) { toast.error("Failed to save address"); return; }
    const saved = data as Address;
    setAddresses([...addresses, saved]);
    setSelectedAddress(saved.id);
    setAddingAddress(false);
    toast.success("Address saved!");
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) { toast.error("Please select a delivery address"); return; }
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error("Payment gateway not configured. Add Razorpay keys to .env.local");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: total }) });
      const { orderId } = await res.json();
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: total * 100, currency: "INR", name: "QuickMart", description: "Order Payment", order_id: orderId,
        handler: async (response) => {
          await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user!.id, addressId: selectedAddress, items, subtotal, deliveryFee, total, paymentId: response.razorpay_payment_id }) });
          clearCart(); toast.success("Order placed successfully!"); router.push("/orders");
        },
        prefill: { name: user?.user_metadata?.full_name, email: user?.email },
        theme: { color: "#16a34a" },
      };
      new window.Razorpay(options).open();
    } catch { toast.error("Payment failed. Please try again."); }
    finally { setLoading(false); }
  }

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">🛒</p>
      <p className="text-xl font-bold text-gray-900">Your cart is empty</p>
      <Button onClick={() => router.push("/")} variant="primary">Shop Now</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><MapPin size={18} className="text-green-600" /> Delivery Address</h2>
              <button onClick={() => setAddingAddress(!addingAddress)} className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline"><Plus size={14} /> Add New</button>
            </div>
            {addingAddress && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 rounded-2xl p-5 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Full name" value={newAddress.full_name} onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} />
                  <Input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                </div>
                <Input placeholder="Address line 1" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
                <Input placeholder="Address line 2 (optional)" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                  <Input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button onClick={saveAddress} variant="primary" size="sm">Save Address</Button>
                  <Button onClick={() => setAddingAddress(false)} variant="ghost" size="sm">Cancel</Button>
                </div>
              </motion.div>
            )}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <button key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedAddress === addr.id ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{addr.full_name} · {addr.label}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                      <p className="text-gray-500 text-sm">{addr.city}, {addr.state} — {addr.pincode}</p>
                      <p className="text-gray-500 text-sm">{addr.phone}</p>
                    </div>
                    {selectedAddress === addr.id && <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />}
                  </div>
                </button>
              ))}
              {addresses.length === 0 && !addingAddress && <p className="text-center text-gray-400 py-6 text-sm">No saved addresses. Add one above.</p>}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><CreditCard size={18} className="text-green-600" /> Order Summary</h2>
            <div className="divide-y divide-gray-50">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between py-2.5 text-sm">
                  <span className="text-gray-600 truncate max-w-[180px]">{product.name} × {quantity}</span>
                  <span className="font-medium text-gray-900">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <Button onClick={handlePlaceOrder} variant="primary" size="lg" className="w-full mt-5" disabled={loading || !selectedAddress}>
              {loading ? <Spinner size="sm" className="text-white" /> : `Pay ${formatPrice(total)}`}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-3">Secured by Razorpay 🔒</p>
          </div>
        </div>
      </div>
    </div>
  );
}
