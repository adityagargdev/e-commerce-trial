"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, ShoppingBag, LogOut, ChevronRight, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const menuItems = [
    { icon: ShoppingBag, label: "My Orders", desc: "View your order history", href: "/orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xl">{initials}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{displayName}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
              <Mail size={13} />
              {user?.email}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {menuItems.map(({ icon: Icon, label, desc, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <User size={17} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Account ID</p>
              <p className="text-xs text-gray-400 font-mono">{user?.id.slice(0, 16)}…</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Shield size={17} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Auth provider</p>
              <p className="text-xs text-gray-400 capitalize">{user?.app_metadata?.provider || "email"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24 }}
        >
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-red-100 bg-white text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
