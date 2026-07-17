"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/supabase/types";

const emptyForm = { name: "", slug: "", description: "", price: "", mrp: "", image_url: "", category_id: "", unit: "piece", stock_quantity: "100", is_in_stock: true, is_featured: false };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const supabase = createClient();
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts(p.data ?? []);
    setCategories(c.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name, slug: product.slug, description: product.description ?? "",
      price: String(product.price), mrp: String(product.mrp ?? ""), image_url: product.image_url ?? "",
      category_id: product.category_id ?? "", unit: product.unit, stock_quantity: String(product.stock_quantity),
      is_in_stock: product.is_in_stock, is_featured: product.is_featured,
    });
    setEditId(product.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: form.description || null,
      price: parseFloat(form.price),
      mrp: form.mrp ? parseFloat(form.mrp) : null,
      image_url: form.image_url || null,
      category_id: form.category_id || null,
      unit: form.unit,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_in_stock: form.is_in_stock,
      is_featured: form.is_featured,
    };
    if (editId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Product created");
    }
    setShowForm(false);
    await load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    await load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <Button onClick={openCreate} variant="primary" size="md">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">{editId ? "Edit Product" : "Add Product"}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Slug</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
                </div>
                <div><label className="text-xs font-medium text-gray-600 block mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none h-20" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Price (₹) *</label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">MRP (₹)</label><Input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} placeholder="0" /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Stock</label><Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="0" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Unit</label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="piece, 1L, 500g..." /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="text-xs font-medium text-gray-600 block mb-1">Image URL</label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_in_stock} onChange={(e) => setForm({ ...form, is_in_stock: e.target.checked })} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} variant="primary" size="md" disabled={saving} className="flex-1">
                  {saving ? <Spinner size="sm" className="text-white" /> : editId ? "Update" : "Create"}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" size="md">Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Product", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.image_url ? <Image src={p.image_url} alt={p.name} fill sizes="40px" className="object-cover" /> : <Package size={16} className="m-auto text-gray-300" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{categories.find((c) => c.id === p.category_id)?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(p.price)}</p>
                    {p.mrp && p.mrp > p.price && <p className="text-xs text-gray-400 line-through">{formatPrice(p.mrp)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.is_in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                      {p.is_in_stock ? `${p.stock_quantity} units` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.is_featured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
                      {p.is_featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No products yet. Add your first product!</p>}
        </div>
      )}
    </div>
  );
}
