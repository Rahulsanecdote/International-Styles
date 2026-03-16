import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: "Services", href: "#services" },
    { name: "Hours", href: "#hours" },
    { name: "Book Now", href: "#booking" },
  ];

  const socialLinks = [
    // TODO: Update with actual Instagram handle
    {
      name: "Instagram",
      href: "https://instagram.com/internationalstyles",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    // TODO: Update with actual Yelp business link
    {
      name: "Yelp",
      href: "https://www.yelp.com/biz/international-styles",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.271.343l-7.662 13.289a.5.5 0 0 0 .433.747h15.31a.5.5 0 0 0 .433-.747L13.123.343a.5.5 0 0 0-.852 0zM12 6.5c.829 0 1.5.671 1.5 1.5s-.671 1.5-1.5 1.5-1.5-.671-1.5-1.5.671-1.5 1.5-1.5zm-1.5 4.5h3v5h-3v-5z" />
        </svg>
      ),
    },
    // TODO: Update with actual Google Business link
    {
      name: "Google",
      href: "https://g.page/international-styles",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
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
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="International Styles Barber Shop"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-xl font-light italic text-[#F5F5F5]">
                International Styles
              </span>
            </Link>
            <p className="font-body text-sm text-[#888888] tracking-wide leading-relaxed">
              Premium barbering and classic grooming since 2001.
              <br />
              <span className="text-[#C9A84C]">Tradition meets precision.</span>
            </p>
          </div>

          {/* Navigation Column */}
          <div className="reveal">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-6">
              Navigation
            </h3>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 tracking-wide"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Column */}
          <div className="reveal">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-6">
              Connect
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a
                href="tel:+12014599090"
                className="block font-body text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 tracking-wide"
              >
                201.459.9090
              </a>
              <a
                href="mailto:info@jcbarbers.com"
                className="block font-body text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 tracking-wide"
              >
                info@jcbarbers.com
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
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#888888]">
              Leave us a review
            </span>

            <div className="flex items-center gap-6">
              {/* TODO: Update review links with actual business profiles */}
              <a
                href="https://www.yelp.com/biz/international-styles"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[11px] tracking-[0.3em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
              >
                Yelp
              </a>

              <a
                href="https://g.page/international-styles/review"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[11px] tracking-[0.3em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
              >
                Google
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-[#1A1A1A]">
          <p className="font-body text-xs text-[#888888] text-center tracking-wide">
            &copy; {currentYear} International Styles Barber Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
