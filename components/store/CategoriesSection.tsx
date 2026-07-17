"use client";

import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import type { Category } from "@/lib/supabase/types";

interface Props {
  categories: Category[];
}

export default function CategoriesSection({ categories }: Props) {
  return (
    <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-amber-400" />
          <div>
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-500 mt-0.5">Everything you need, all in one place</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1">
        {categories.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  );
}
