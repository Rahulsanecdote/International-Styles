"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    booksyWidget: any;
  }
}

export default function Booking() {
  useEffect(() => {
    // Load Booksy widget script
    const script = document.createElement("script");
    script.src = "https://booksy.com/widget/code.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const booksyBusinessId = process.env.NEXT_PUBLIC_BOOKSY_BUSINESS_ID || "";

  return (
    <section id="booking" className="py-28 md:py-36 bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-14 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Book Now
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-6 reveal">
          Reserve Your Seat
        </h2>

        {/* Subtitle */}
        <p className="font-body text-sm text-[#888888] tracking-wide mb-12 max-w-2xl reveal">
          Schedule your appointment online. Select your preferred service and time below.
          <br />
          <span className="text-[#C9A84C]">Walk-ins welcome</span> or call{" "}
          <a href="tel:+12014599090" className="text-[#C9A84C] hover:text-[#E8C96A] transition-colors duration-300">
            201.459.9090
          </a>
        </p>

        {/* Booksy Widget Embed */}
        <div className="reveal">
          {booksyBusinessId ? (
            <iframe
              src={`https://booksy.com/widget/booking?business_id=${booksyBusinessId}`}
              width="100%"
              height="700"
              frameBorder="0"
              className="border border-[#222222]"
              title="Booksy Booking Widget"
            />
          ) : (
            <div className="bg-[#111111] border border-[#222222] p-12 text-center">
              <p className="text-[#C9A84C] font-body text-lg mb-4">
                Online booking coming soon!
              </p>
              <p className="text-[#888888] font-body mb-6">
                Please call us to schedule your appointment
              </p>
              <a
                href="tel:+12014599090"
                className="inline-block bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 font-body text-sm uppercase tracking-wider hover:bg-[#E8C96A] transition-all"
              >
                Call 201.459.9090
              </a>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-12 border-t border-[#1A1A1A] reveal">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
                Cancellation Policy
              </h3>
              <p className="font-body text-sm text-[#888888] tracking-wide">
                Please provide 24 hours notice for cancellations
              </p>
            </div>

            <div>
              <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
                Walk-Ins
              </h3>
              <p className="font-body text-sm text-[#888888] tracking-wide">
                Always welcome based on availability
              </p>
            </div>

            <div>
              <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
                Payment
              </h3>
              <p className="font-body text-sm text-[#888888] tracking-wide">
                Cash, card, and digital payments accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
