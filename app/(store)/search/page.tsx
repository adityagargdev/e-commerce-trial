"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/store/ProductCard";
import { Spinner } from "@/components/ui/spinner";
import type { Product } from "@/lib/supabase/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .ilike("name", `%${query}%`)
      .eq("is_in_stock", true)
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Search size={20} className="text-gray-400" />
        <h1 className="text-xl font-bold text-gray-900">
          {query ? `Results for "${query}"` : "Search Products"}
        </h1>
        {!loading && query && (
          <span className="text-sm text-gray-400">({products.length} found)</span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 && query ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-gray-700">No products found for &quot;{query}&quot;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
