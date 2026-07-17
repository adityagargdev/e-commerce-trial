import Link from "next/link";
import { Mail, Phone, Zap } from "lucide-react";

const links = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Order", href: "/orders" },
    { label: "Return Policy", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                Quick<span className="text-amber-400">Mart</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Fresh groceries and daily essentials delivered to your doorstep in 10 minutes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={13} className="text-amber-400" />
                <span>1800-123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={13} className="text-amber-400" />
                <span>support@quickmart.in</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {links.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {links.support.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              {links.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} QuickMart. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>Made in India 🇮🇳</span>
            <span>·</span>
            <span className="text-amber-500 font-bold">Fast. Fresh. Reliable.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
