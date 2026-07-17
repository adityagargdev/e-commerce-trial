"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { Product, Category } from "@/lib/supabase/types";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { items, addItem, updateQuantity } = useCartStore();

  const cartItem = items.find((i) => i.product.id === id);
  const quantity = cartItem?.quantity ?? 0;
  const discount = product ? getDiscountPercent(product.mrp ?? 0, product.price) : 0;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      const p = data as Product | null;
      setProduct(p);
      if (p?.category_id) {
        const { data: catData } = await supabase.from("categories").select("*").eq("id", p.category_id).single();
        setCategory(catData as Category | null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
        <Link href="/" className="mt-4 text-green-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <ChevronRight size={14} />
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-gray-700 transition-colors">{category.name}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🛒</div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 left-4">
              <Badge variant="discount" className="text-sm px-3 py-1">{discount}% OFF</Badge>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          {category && (
            <Link href={`/category/${category.slug}`} className="text-sm text-green-600 font-medium hover:underline mb-2">
              {category.icon} {category.name}
            </Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{product.unit}</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-black text-gray-900">{formatPrice(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
            )}
            {discount > 0 && (
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                Save {formatPrice(product.mrp! - product.price)}
              </span>
            )}
          </div>

          {product.description && <p className="text-gray-600 text-sm leading-relaxed mt-4">{product.description}</p>}

          <div className="mt-4">
            {product.is_in_stock
              ? <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
              : <span className="text-sm text-red-500 font-medium">Out of Stock</span>}
          </div>

          <div className="mt-6">
            {quantity === 0 ? (
              <button
                onClick={() => { addItem(product); toast.success("Added to cart!"); }}
                disabled={!product.is_in_stock}
                className="flex items-center gap-2 h-12 px-8 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-green-600/20"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-green-600">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors"><Minus size={16} /></button>
                  <span className="text-white text-lg font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors"><Plus size={16} /></button>
                </div>
                <span className="text-sm text-gray-500">{quantity} in cart</span>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ icon: Truck, label: "Fast Delivery" }, { icon: Shield, label: "Fresh & Safe" }, { icon: RotateCcw, label: "Easy Returns" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 text-center">
                <Icon size={18} className="text-green-600" />
                <span className="text-xs text-gray-600 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
