"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/supabase/types";

interface Props {
  products: Product[];
}

export default function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-green-500" />
          <div>
            <h2 className="text-2xl font-black text-gray-900">Best Sellers</h2>
            <p className="text-sm text-gray-500 mt-0.5">Loved by thousands of customers</p>
          </div>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
        >
          See all <ArrowRight size={14} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
