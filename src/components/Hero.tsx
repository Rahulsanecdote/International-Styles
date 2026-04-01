"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial Gold Glow Background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#C9A84C]/5 via-transparent to-transparent opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-16 text-center">
        {/* Full Logo - Hero Centerpiece */}
        <div className="relative w-full max-w-[840px] h-[200px] md:h-[280px] mx-auto mb-10 opacity-0 animate-fade-up animation-delay-1">
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up animation-delay-4">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display text-[9px] tracking-[0.4em] uppercase text-[#888888]">
            Scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-[#C9A84C] to-transparent" />
        </div>
      </div>
    </section>
  );
}
