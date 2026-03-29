"use client";

import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/config";

export default function Booking() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const widgetUrl = process.env.NEXT_PUBLIC_BOOKSY_WIDGET_URL || "";
  const profileUrl =
    process.env.NEXT_PUBLIC_BOOKSY_PROFILE_URL ||
    "https://booksy.com/en-us/7016_international-styles-barbershop_barber-shop_28561_jersey-city";

  useEffect(() => {
    if (!widgetUrl) {
      setWidgetError(true);
      return;
    }

    const script = document.createElement("script");
    script.src = widgetUrl;
    script.async = true;
    script.onload = () => setWidgetLoaded(true);
    script.onerror = () => setWidgetError(true);
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [widgetUrl]);

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
          <a href={`tel:${BUSINESS.phoneTel}`} className="text-[#C9A84C] hover:text-[#E8C96A] transition-colors duration-300">
            {BUSINESS.phoneDot}
          </a>
        </p>

        {/* Booksy Widget */}
        <div className="reveal">
          {widgetError ? (
            <div className="bg-[#111111] border border-[#222222] p-12 text-center">
              <p className="text-[#C9A84C] font-display text-2xl font-light italic mb-4">
                Book on Booksy
              </p>
              <p className="text-[#888888] font-body text-sm tracking-wide mb-8">
                Schedule your appointment directly through our Booksy page
              </p>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-[11px] tracking-[0.3em] uppercase px-10 py-4 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
              >
                Book on Booksy
              </a>
              <p className="text-[#888888] font-body text-sm tracking-wide mt-6">
                or call{" "}
                <a href={`tel:${BUSINESS.phoneTel}`} className="text-[#C9A84C] hover:text-[#E8C96A] transition-colors duration-300">
                  {BUSINESS.phoneDot}
                </a>
              </p>
            </div>
          ) : (
            <>
              {/* Loading skeleton shown until widget script loads */}
              {!widgetLoaded && (
                <div className="bg-[#111111] border border-[#222222] p-12 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-[#C9A84C] border-t-transparent animate-spin mb-4" />
                  <p className="text-[#888888] font-body text-sm tracking-wide">
                    Loading booking widget...
                  </p>
                </div>
              )}
              {/* Booksy widget renders into this container */}
              <div id="booksy-widget-container" data-booksy-id="7016" />
            </>
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
