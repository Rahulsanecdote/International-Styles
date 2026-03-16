"use client";

import { useEffect, useState } from "react";

export default function Hours() {
  const [currentDay, setCurrentDay] = useState<number | null>(null);

  useEffect(() => {
    // Get current day (0 = Sunday, 1 = Monday, etc.)
    setCurrentDay(new Date().getDay());
  }, []);

  const hours = [
    { day: "Monday", time: "10:00 AM - 7:00 PM", dayIndex: 1 },
    { day: "Tuesday", time: "10:00 AM - 7:00 PM", dayIndex: 2 },
    { day: "Wednesday", time: "10:00 AM - 7:00 PM", dayIndex: 3 },
    { day: "Thursday", time: "10:00 AM - 7:00 PM", dayIndex: 4 },
    { day: "Friday", time: "9:00 AM - 7:00 PM", dayIndex: 5 },
    { day: "Saturday", time: "9:00 AM - 7:00 PM", dayIndex: 6 },
    { day: "Sunday", time: "Closed", dayIndex: 0 },
  ];

  return (
    <section id="hours" className="py-28 md:py-36 bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-14 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Visit Us
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-16 reveal">
          Hours & Location
        </h2>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          {/* Hours Column */}
          <div className="reveal">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-8">
              Business Hours
            </h3>
            <div className="space-y-5">
              {hours.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-3 border-b border-[#1A1A1A] transition-all duration-300 ${
                    currentDay === item.dayIndex
                      ? "text-[#C9A84C] border-[#C9A84C]/30"
                      : "text-[#888888]"
                  }`}
                >
                  <span className="font-body text-sm tracking-wide">
                    {item.day}
                  </span>
                  <span className="font-display text-lg font-light">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Column */}
          <div className="reveal">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] mb-8">
              Location
            </h3>

            <address className="not-italic mb-8">
              <p className="font-display text-xl font-light text-[#F5F5F5] leading-relaxed mb-2">
                278 First St,
              </p>
              <p className="font-display text-xl font-light text-[#F5F5F5] leading-relaxed">
                Jersey City, NJ
              </p>
            </address>

            {/* Contact Info */}
            <div className="space-y-4 mb-10">
              <a
                href="tel:+12014599090"
                className="flex items-center gap-3 text-[#888888] hover:text-[#C9A84C] transition-colors duration-300"
              >
                <span className="font-body text-sm tracking-wide">
                  201.459.9090
                </span>
              </a>

              <a
                href="mailto:info@internationalstyles.com"
                className="flex items-center gap-3 text-[#888888] hover:text-[#C9A84C] transition-colors duration-300"
              >
                <span className="font-body text-sm tracking-wide">
                  info@internationalstyles.com
                </span>
              </a>
            </div>

            {/* Get Directions Link */}
            <a
              href="https://maps.google.com/?q=278+First+St+Jersey+City+NJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 group"
            >
              <span className="font-body text-[11px] tracking-[0.3em] uppercase text-[#888888] group-hover:text-[#C9A84C] transition-colors duration-300">
                Get Directions
              </span>
              <div className="w-0 group-hover:w-12 h-px bg-[#C9A84C] transition-all duration-500" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
