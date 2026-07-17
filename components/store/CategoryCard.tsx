"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/lib/supabase/types";

const categoryStyles: Record<string, { card: string; icon: string }> = {
  "fruits-vegetables": { card: "bg-green-50 border-green-100 hover:border-green-300",  icon: "bg-green-100" },
  "dairy-eggs":        { card: "bg-yellow-50 border-yellow-100 hover:border-yellow-300", icon: "bg-yellow-100" },
  "snacks":            { card: "bg-orange-50 border-orange-100 hover:border-orange-300", icon: "bg-orange-100" },
  "beverages":         { card: "bg-blue-50 border-blue-100 hover:border-blue-300",       icon: "bg-blue-100" },
  "personal-care":     { card: "bg-pink-50 border-pink-100 hover:border-pink-300",       icon: "bg-pink-100" },
  "household":         { card: "bg-purple-50 border-purple-100 hover:border-purple-300", icon: "bg-purple-100" },
  "frozen":            { card: "bg-sky-50 border-sky-100 hover:border-sky-300",          icon: "bg-sky-100" },
  "bakery":            { card: "bg-amber-50 border-amber-100 hover:border-amber-300",    icon: "bg-amber-100" },
};

const defaultStyle = { card: "bg-gray-50 border-gray-100 hover:border-gray-300", icon: "bg-gray-100" };

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const style = categoryStyles[category.slug] ?? defaultStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link href={`/category/${category.slug}`} className="block group">
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`rounded-2xl border-2 ${style.card} p-4 flex flex-col items-center gap-3 transition-colors shadow-sm group-hover:shadow-md`}
        >
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${style.icon} flex items-center justify-center text-3xl`}>
            {category.icon ?? "📦"}
          </div>

          {/* Name */}
          <p className="text-xs font-bold text-gray-800 text-center leading-tight group-hover:text-amber-600 transition-colors">
            {category.name}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
