import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/store/ProductCard";
import type { Category, Product } from "@/lib/supabase/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("name").eq("slug", slug).single();
  const cat = data as { name: string } | null;
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: catData } = await supabase.from("categories").select("*").eq("slug", slug).single();
  const category = catData as Category | null;
  if (!category) notFound();

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .order("name");
  const products = (productsData ?? []) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="text-gray-500 text-sm mt-0.5">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p className="font-semibold text-gray-600">No products in this category yet</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
