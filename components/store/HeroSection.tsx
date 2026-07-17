"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const quickSearches = ["Milk", "Eggs", "Bread", "Fruits", "Vegetables", "Chips"];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      {/* Main hero banner */}
      <section className="bg-amber-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-300/60 pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-32 h-32 rounded-full bg-amber-500/40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Delivery pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 bg-black/15 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide"
          >
            <Zap size={12} className="fill-gray-900" />
            Delivery in 10 minutes
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight max-w-xl"
          >
            Groceries at
            <br />
            your door.
            <br />
            <span className="text-white">In minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 text-base text-gray-800 max-w-md font-medium"
          >
            Fresh produce, pantry staples, snacks and more — straight to your doorstep.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            onSubmit={handleSearch}
            className="mt-7 flex gap-2 max-w-lg"
          >
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search for milk, eggs, vegetables..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 active:scale-[0.97] transition-all shadow-lg whitespace-nowrap"
            >
              Search
            </button>
          </motion.form>

          {/* Quick search chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {quickSearches.map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/search?q=${term}`)}
                className="px-3.5 py-1.5 rounded-full bg-black/10 hover:bg-black/20 text-gray-900 text-xs font-bold transition-colors"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust / feature strip */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center sm:justify-start gap-8 py-3 overflow-x-auto scrollbar-hide">
            {[
              { icon: Zap, label: "10-min delivery", color: "text-amber-400" },
              { icon: Truck, label: "Free above ₹499", color: "text-green-400" },
              { icon: ShieldCheck, label: "100% fresh guarantee", color: "text-blue-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 whitespace-nowrap">
                <Icon size={15} className={color} />
                <span className="text-sm font-semibold text-gray-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
