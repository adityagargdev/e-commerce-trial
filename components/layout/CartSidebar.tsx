"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } =
    useCartStore();

  const total = totalPrice();
  const deliveryFee = total > 499 ? 0 : 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                {items.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    {items.length} item{items.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-5 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add items to get started
                    </p>
                  </div>
                  <Button onClick={closeCart} variant="primary" size="md">
                    Browse Products
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {items.map(({ product, quantity }) => (
                    <motion.li
                      key={product.id}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      {/* Image */}
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🛒
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {product.unit}
                        </p>
                        <p className="text-sm font-bold text-green-600 mt-1">
                          {formatPrice(product.price * quantity)}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            quantity === 1
                              ? removeItem(product.id)
                              : updateQuantity(product.id, quantity - 1)
                          }
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 transition-colors text-gray-600"
                        >
                          {quantity === 1 ? (
                            <Trash2 size={12} className="text-red-400" />
                          ) : (
                            <Minus size={12} />
                          )}
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-5 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                {/* Delivery notice */}
                {deliveryFee === 0 ? (
                  <div className="flex items-center gap-2 mb-3 text-green-600 text-xs font-semibold bg-green-50 rounded-lg px-3 py-2">
                    <span>🎉</span> Free delivery on this order!
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-3 text-amber-600 text-xs font-medium bg-amber-50 rounded-lg px-3 py-2">
                    <span>🚚</span> Add {formatPrice(499 - total)} more for free delivery
                  </div>
                )}

                {/* Bill summary */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-medium" : "font-medium"}>
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(total + deliveryFee)}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
