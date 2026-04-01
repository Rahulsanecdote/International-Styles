"use client";

import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/config";

export default function Hero() {
  const instagramUrl = "https://www.instagram.com/intl_stylesbarbershop";
  const booksyUrl =
    process.env.NEXT_PUBLIC_BOOKSY_PROFILE_URL ||
    "https://booksy.com/en-us/7016_international-styles-barbershop_barber-shop_28561_jersey-city";

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Radial Gold Glow Background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#C9A84C]/5 via-transparent to-transparent opacity-30" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-4xl grid-rows-[1fr_auto] px-6 pt-24 pb-10 text-center lg:px-16 md:pt-28 md:pb-12">
        <div className="flex items-center justify-center">
          <div className="w-full">
            {/* Full Logo - Hero Centerpiece */}
            <div className="relative w-full max-w-[1000px] h-[260px] md:h-[360px] mx-auto mb-10 opacity-0 animate-fade-up animation-delay-1">
              <Image
                src="/logo-full.png"
                alt="International Styles Barber Shop"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Subheading */}
            <p className="font-display text-[11px] md:text-[12px] tracking-[0.45em] uppercase text-[#888888] mb-6 opacity-0 animate-fade-up animation-delay-2">
              Barber Shop
            </p>

            {/* Divider Line */}
            <div className="w-20 h-px bg-[#C9A84C] mx-auto mb-10 opacity-0 animate-fade-up animation-delay-3" />

            {/* Tagline */}
            <p className="font-display text-2xl md:text-3xl font-light text-[#F5F5F5] mb-12 max-w-2xl mx-auto opacity-0 animate-fade-up animation-delay-3">
              Precision cuts and timeless grooming.
              <br />
              <span className="italic text-[#C9A84C]">Est. 2001</span>
            </p>

            {/* CTA Button */}
            <Link
              href="#booking"
              className="inline-block font-display text-[11px] tracking-[0.3em] uppercase px-10 py-4 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500 opacity-0 animate-fade-up animation-delay-4"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Contact Stack */}
        <div className="flex justify-center pt-12 opacity-0 animate-fade-up animation-delay-4 md:pt-16">
          <div className="flex flex-col items-center text-center">
            <span className="font-display text-[9px] tracking-[0.48em] uppercase text-[#C9A84C]">
              Connect
            </span>
            <div className="mt-4 h-14 w-px bg-gradient-to-b from-[#C9A84C] to-[#C9A84C]/10" />

            <div className="mt-8 space-y-5">
              <a
                href={`tel:${BUSINESS.phoneTel}`}
                className="block font-display text-[clamp(1.6rem,2vw,2.2rem)] font-light text-[#9A9A9A] hover:text-[#C9A84C] transition-colors duration-300"
              >
                {BUSINESS.phoneDot}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="block font-display text-[clamp(1.6rem,2vw,2.2rem)] font-light text-[#9A9A9A] hover:text-[#C9A84C] transition-colors duration-300"
              >
                {BUSINESS.email}
              </a>
            </div>

            <div className="mt-10 flex items-center gap-8 text-[#9A9A9A]">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A84C] transition-colors duration-300"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href={booksyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A84C] transition-colors duration-300"
                aria-label="Book on Booksy"
                title="Book on Booksy"
              >
                <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14h2v2H9v-2zm4 0h2v2h-2v-2zm-4-4h2v2H9v-2zm4 0h2v2h-2v-2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
