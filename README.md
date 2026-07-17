# QuickMart

A full-stack grocery quick-commerce PWA built with Next.js 16, Supabase, and Razorpay. Inspired by Blinkit — delivers groceries in minutes.

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Styling** — Tailwind CSS v4
- **Animations** — Framer Motion v12
- **Database & Auth** — Supabase (PostgreSQL)
- **Cart State** — Zustand v5
- **Payments** — Razorpay (test mode)
- **PWA** — Manual service worker + web manifest
- **Icons** — Lucide React

## Features

- Browse products by category with real-time search
- Animated cart sidebar with quantity controls
- Supabase authentication (email/password)
- Address management at checkout
- Razorpay payment integration
- Order history page
- Admin panel — product, category, and order management
- Admin route protection via Next.js middleware
- PWA-ready with service worker and manifest

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/adityagargdev/e-commerce-trial.git
cd e-commerce-trial
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Set up Supabase

Run the following in your Supabase SQL Editor to create the profile trigger:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (store)/       # Customer-facing pages
  (auth)/        # Login & signup
  admin/         # Admin dashboard
  api/           # Payment & order API routes
  auth/          # OAuth callback
components/
  layout/        # Navbar, Footer, CartSidebar
  store/         # ProductCard, CategoryCard, HeroSection, etc.
  ui/            # Base UI components
lib/
  supabase/      # Supabase client (browser + server)
  store/         # Zustand cart store
public/
  manifest.json  # PWA manifest
  sw.js          # Service worker
```

## Database Tables

`profiles` · `categories` · `products` · `addresses` · `orders` · `order_items` · `banners`

## Test Payments

Use Razorpay test mode. For net banking, select any bank — it auto-succeeds. For cards, enable international cards in your Razorpay dashboard settings.
