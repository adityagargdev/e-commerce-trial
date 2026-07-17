"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/supabase/types";

interface Props {
  products: Product[];
}

export default function DealsSection({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-gray-900">Today&apos;s Deals</h2>
                <span className="inline-flex items-center gap-1 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  <Zap size={9} className="fill-white" /> HOT
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Limited time offers — grab them fast</p>
            </div>
          </div>
          <Link
            href="/deals"
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            See all <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
