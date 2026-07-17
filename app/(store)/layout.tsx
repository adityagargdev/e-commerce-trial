import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";
import { AuthHandler } from "@/components/layout/AuthHandler";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHandler />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
    </>
  );
}
