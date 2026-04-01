import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: "Services", href: "#services" },
    { name: "Hours", href: "#hours" },
    { name: "Book Now", href: "#booking" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/intl_stylesbarbershop",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Booksy",
      href: "https://booksy.com/en-us/7016_international-styles-barbershop_barber-shop_28561_jersey-city",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14h2v2H9v-2zm4 0h2v2h-2v-2zm-4-4h2v2H9v-2zm4 0h2v2h-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="reveal">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-icon.png"
                  alt="International Styles Barber Shop"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-display text-sm tracking-[0.15em] uppercase text-[#F5F5F5] block">
                  International Styles
                </span>
                <span className="font-display text-[9px] tracking-[0.2em] uppercase text-[#888888]">
                  Barber Shop · Est. 2001
                </span>
              </div>
            </Link>
            <p className="font-display text-sm text-[#888888] tracking-wide leading-relaxed">
              Premium barbering and classic grooming since 2001.
              <br />
              <span className="text-[#C9A84C]">Tradition meets precision.</span>
            </p>
          </div>

          {/* Navigation Column */}
          <div className="reveal">
            <h3 className="font-display text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-6">
              Navigation
            </h3>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-display text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 tracking-wide"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Column */}
          <div className="reveal">
            <h3 className="font-display text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-6">
              Connect
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a
                href={`tel:${BUSINESS.phoneTel}`}
                className="block font-display text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 tracking-wide"
              >
                {BUSINESS.phoneDot}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="block font-display text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 tracking-wide"
              >
                {BUSINESS.email}
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888888] hover:text-[#C9A84C] transition-colors duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Review CTAs */}
        <div className="py-10 border-t border-[#1A1A1A]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 reveal">
            <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#888888]">
              Leave us a review
            </span>

            <div className="flex items-center gap-6">
              <a
                href="https://booksy.com/en-us/7016_international-styles-barbershop_barber-shop_28561_jersey-city"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[11px] tracking-[0.3em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
              >
                Booksy
              </a>

              <a
                href="https://www.instagram.com/intl_stylesbarbershop"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[11px] tracking-[0.3em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-[#1A1A1A]">
          <p className="font-display text-xs text-[#888888] text-center tracking-wide">
            &copy; {currentYear} International Styles Barber Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
