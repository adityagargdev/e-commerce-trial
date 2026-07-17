import type { Category, Product, Banner } from "@/lib/supabase/types";

export const mockCategories: Category[] = [
  { id: "1", name: "Fruits & Vegetables", slug: "fruits-vegetables", icon: "🥦", image_url: null, description: "Fresh produce", parent_id: null, sort_order: 1, is_active: true, created_at: "" },
  { id: "2", name: "Dairy & Eggs", slug: "dairy-eggs", icon: "🥛", image_url: null, description: "Fresh dairy", parent_id: null, sort_order: 2, is_active: true, created_at: "" },
  { id: "3", name: "Snacks", slug: "snacks", icon: "🍿", image_url: null, description: "Snacks & munchies", parent_id: null, sort_order: 3, is_active: true, created_at: "" },
  { id: "4", name: "Beverages", slug: "beverages", icon: "🧃", image_url: null, description: "Drinks", parent_id: null, sort_order: 4, is_active: true, created_at: "" },
  { id: "5", name: "Personal Care", slug: "personal-care", icon: "🧴", image_url: null, description: "Hygiene & care", parent_id: null, sort_order: 5, is_active: true, created_at: "" },
  { id: "6", name: "Household", slug: "household", icon: "🧹", image_url: null, description: "Cleaning & home", parent_id: null, sort_order: 6, is_active: true, created_at: "" },
  { id: "7", name: "Frozen Food", slug: "frozen", icon: "🧊", image_url: null, description: "Frozen items", parent_id: null, sort_order: 7, is_active: true, created_at: "" },
  { id: "8", name: "Bakery", slug: "bakery", icon: "🍞", image_url: null, description: "Breads & cakes", parent_id: null, sort_order: 8, is_active: true, created_at: "" },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "Amul Full Cream Milk", slug: "amul-full-cream-milk", description: "Fresh full cream milk", price: 65, mrp: 68, image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop", images: null, category_id: "2", unit: "1L", stock_quantity: 50, is_in_stock: true, is_featured: true, tags: ["dairy"], created_at: "", updated_at: "" },
  { id: "p2", name: "Organic Bananas", slug: "organic-bananas", description: "Fresh organic bananas", price: 49, mrp: 60, image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop", images: null, category_id: "1", unit: "1 dozen", stock_quantity: 30, is_in_stock: true, is_featured: true, tags: ["fruits"], created_at: "", updated_at: "" },
  { id: "p3", name: "Britannia Bourbon Biscuits", slug: "britannia-bourbon", description: "Classic chocolate biscuits", price: 30, mrp: 35, image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop", images: null, category_id: "3", unit: "150g", stock_quantity: 100, is_in_stock: true, is_featured: false, tags: ["snacks", "biscuits"], created_at: "", updated_at: "" },
  { id: "p4", name: "Tropicana Orange Juice", slug: "tropicana-orange", description: "100% real orange juice", price: 99, mrp: 120, image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop", images: null, category_id: "4", unit: "1L", stock_quantity: 40, is_in_stock: true, is_featured: true, tags: ["beverages", "juice"], created_at: "", updated_at: "" },
  { id: "p5", name: "Dove Body Wash", slug: "dove-body-wash", description: "Moisturising body wash", price: 185, mrp: 220, image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop", images: null, category_id: "5", unit: "200ml", stock_quantity: 25, is_in_stock: true, is_featured: false, tags: ["personal-care"], created_at: "", updated_at: "" },
  { id: "p6", name: "Ezee Liquid Detergent", slug: "ezee-detergent", description: "Gentle fabric wash", price: 140, mrp: 160, image_url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop", images: null, category_id: "6", unit: "500ml", stock_quantity: 35, is_in_stock: true, is_featured: false, tags: ["household"], created_at: "", updated_at: "" },
  { id: "p7", name: "Farm Fresh Eggs", slug: "farm-fresh-eggs", description: "Free range eggs", price: 84, mrp: 90, image_url: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400&h=400&fit=crop", images: null, category_id: "2", unit: "12 pcs", stock_quantity: 60, is_in_stock: true, is_featured: true, tags: ["dairy", "eggs"], created_at: "", updated_at: "" },
  { id: "p8", name: "Lay's Classic Salted", slug: "lays-classic", description: "Crispy potato chips", price: 20, mrp: 20, image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop", images: null, category_id: "3", unit: "26g", stock_quantity: 200, is_in_stock: true, is_featured: false, tags: ["snacks", "chips"], created_at: "", updated_at: "" },
];

export const mockBanners: Banner[] = [
  { id: "b1", title: "Fresh Groceries Daily", subtitle: "Delivered in 10 minutes", image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=600&fit=crop", link: "/category/fruits-vegetables", sort_order: 1, is_active: true, created_at: "" },
  { id: "b2", title: "50% Off Dairy Products", subtitle: "This weekend only", image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&h=600&fit=crop", link: "/category/dairy-eggs", sort_order: 2, is_active: true, created_at: "" },
];
