"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, MapPin, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";

const CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Snacks",
  "Beverages",
  "Personal Care",
  "Household",
  "Frozen",
  "Bakery",
];

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { totalItems, openCart } = useCartStore();
  const itemCount = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm group-hover:bg-amber-300 transition-colors">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="text-gray-900 font-black text-xl hidden sm:block tracking-tight">
                Quick<span className="text-amber-500">Mart</span>
              </span>
            </Link>

            {/* Delivery location */}
            <button className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm border-l border-gray-200 pl-4 ml-1">
              <MapPin size={14} className="text-amber-500" />
              <div className="text-left">
                <p className="text-[10px] text-gray-400 leading-none">Delivery in</p>
                <p className="font-bold text-gray-900 text-sm leading-tight">10 minutes</p>
              </div>
            </button>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-2">
              <div className="relative w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder='Search for groceries, snacks, essentials...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 transition-colors"
              >
                <ShoppingCart size={18} className="text-white" />
                {itemCount > 0 ? (
                  <span className="text-white text-sm font-bold hidden sm:block">{itemCount} item{itemCount > 1 ? "s" : ""}</span>
                ) : (
                  <span className="text-white text-sm font-bold hidden sm:block">Cart</span>
                )}
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center sm:hidden"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              <Link
                href="/account"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100"
              >
                <User size={20} />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden md:hidden pb-3"
              >
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      ref={searchRef}
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category strip */}
        <nav className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
            <ul className="flex items-center gap-0.5 h-10 text-sm whitespace-nowrap">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="px-3 py-1 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-xl md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors text-sm font-medium"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-amber-400 text-white text-sm font-semibold hover:bg-amber-300 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
