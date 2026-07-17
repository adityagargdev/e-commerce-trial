import type { Metadata } from "next";
import HeroSection from "@/components/store/HeroSection";
import CategoriesSection from "@/components/store/CategoriesSection";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import DealsSection from "@/components/store/DealsSection";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "QuickMart — Groceries in Minutes",
  description: "Order fresh groceries, dairy, snacks and daily essentials. Delivered fast to your doorstep.",
};

export default async function HomePage() {
  const supabase = await createClient();

  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("*").eq("is_in_stock", true).order("created_at", { ascending: false }),
  ]);

  const categories = (categoriesRes.data ?? []) as Category[];
  const allProducts = (productsRes.data ?? []) as Product[];

  const featuredProducts = allProducts.filter((p) => p.is_featured);
  const dealProducts = allProducts.filter((p) => p.mrp !== null && p.mrp > p.price);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <DealsSection products={dealProducts} />
      <FeaturedProducts products={featuredProducts} />
    </div>
  );
}
