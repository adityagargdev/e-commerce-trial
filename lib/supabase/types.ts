export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          image_url: string | null;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          icon?: string | null;
          image_url?: string | null;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          image_url?: string | null;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          mrp: number | null;
          image_url: string | null;
          images: string[] | null;
          category_id: string | null;
          unit: string;
          stock_quantity: number;
          is_in_stock: boolean;
          is_featured: boolean;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          mrp?: number | null;
          image_url?: string | null;
          images?: string[] | null;
          category_id?: string | null;
          unit?: string;
          stock_quantity?: number;
          is_in_stock?: boolean;
          is_featured?: boolean;
          tags?: string[] | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          mrp?: number | null;
          image_url?: string | null;
          images?: string[] | null;
          category_id?: string | null;
          unit?: string;
          stock_quantity?: number;
          is_in_stock?: boolean;
          is_featured?: boolean;
          tags?: string[] | null;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          label?: string;
          full_name: string;
          phone: string;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
        };
        Update: {
          label?: string;
          full_name?: string;
          phone?: string;
          line1?: string;
          line2?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          address_id: string;
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          payment_id: string | null;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          address_id: string;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal: number;
          delivery_fee?: number;
          discount?: number;
          total: number;
          payment_id?: string | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          notes?: string | null;
        };
        Update: {
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_id?: string | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          notes?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          order_id: string;
          product_id: string;
          product_name: string;
          product_image?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: never;
      };
      banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          image_url: string;
          link: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          title?: string | null;
          subtitle?: string | null;
          image_url: string;
          link?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          title?: string | null;
          subtitle?: string | null;
          image_url?: string;
          link?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type Address = Tables<"addresses">;
export type Banner = Tables<"banners">;
export type Profile = Tables<"profiles">;
