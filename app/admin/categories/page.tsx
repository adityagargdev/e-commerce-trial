"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { Category } from "@/lib/supabase/types";

const emptyForm = { name: "", slug: "", icon: "", description: "", sort_order: "0", is_active: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openEdit(cat: Category) {
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon ?? "", description: cat.description ?? "", sort_order: String(cat.sort_order), is_active: cat.is_active });
    setEditId(cat.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: form.icon || null,
      description: form.description || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };
    if (editId) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Category created");
    }
    setShowForm(false);
    setEditId(null);
    await load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    toast.success("Deleted");
    await load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} variant="primary" size="md">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-lg font-bold mb-5">{editId ? "Edit Category" : "Add Category"}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Icon (emoji)</label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🥦" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Slug</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto" /></div>
                  <div><label className="text-xs font-medium text-gray-600 block mb-1">Sort Order</label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
                </div>
                <div><label className="text-xs font-medium text-gray-600 block mb-1">Description</label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-green-600" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} variant="primary" disabled={saving} className="flex-1">
                  {saving ? <Spinner size="sm" className="text-white" /> : editId ? "Update" : "Create"}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="ghost">Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon ?? "📦"}</span>
                <div>
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400">{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
