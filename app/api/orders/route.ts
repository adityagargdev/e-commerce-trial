import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CartItem } from "@/lib/store/cart";

export async function POST(req: NextRequest) {
  try {
    const { userId, addressId, items, subtotal, deliveryFee, total, paymentId } = await req.json();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
      }
    );

    const { data: order, error } = await supabase
      .from("orders")
      .insert({ user_id: userId, address_id: addressId, subtotal, delivery_fee: deliveryFee, total, payment_id: paymentId, payment_status: "paid", status: "confirmed" })
      .select()
      .single();

    if (error || !order) return NextResponse.json({ error: "Failed to create order" }, { status: 500 });

    const savedOrder = order as { id: string };
    const orderItems = (items as CartItem[]).map((item) => ({
      order_id: savedOrder.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);
    return NextResponse.json({ orderId: savedOrder.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
