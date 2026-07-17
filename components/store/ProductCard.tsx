"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/supabase/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const discount = getDiscountPercent(product.mrp ?? 0, product.price);
  const [imageError, setImageError] = useState(false);

  function handleAdd() {
    addItem(product);
    toast.success(`${product.name} added to cart`, { duration: 1500 });
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {!imageError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🛒
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {discount}% OFF
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        {/* Delivery time */}
        <div className="flex items-center gap-1 mb-1.5">
          <Zap size={10} className="text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-bold text-amber-600">10 MINS</span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug hover:text-amber-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{product.unit}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-base font-black text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through font-medium">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <div className="mt-3">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleAdd}
                disabled={!product.is_in_stock}
                className="w-full h-9 rounded-xl border-2 border-green-600 text-green-600 text-xs font-black flex items-center justify-center gap-1 hover:bg-green-600 hover:text-white active:scale-[0.97] transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <Plus size={14} />
                ADD
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between bg-green-600 rounded-xl h-9 px-1.5"
              >
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="text-white text-sm font-black">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
