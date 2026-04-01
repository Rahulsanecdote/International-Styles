"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
  date: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // TODO: Replace with actual customer testimonials
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Michael Torres",
      service: "Precision Fade",
      rating: 5,
      text: "Best barbershop in Jersey City. The attention to detail is unmatched. Been coming here for 5 years and never disappointed.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "David Chen",
      service: "Classic Cut & Beard Trim",
      rating: 5,
      text: "Professional service in a great atmosphere. The barbers really know their craft. Highly recommend for anyone looking for quality work.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "James Rodriguez",
      service: "Straight Razor Shave",
      rating: 5,
      text: "Traditional barbering at its finest. The straight razor shave is an experience you won't find anywhere else. True professionals.",
      date: "3 weeks ago",
    },
    {
      id: 4,
      name: "Robert Kim",
      service: "Haircut",
      rating: 5,
      text: "Clean shop, skilled barbers, and great conversation. This is my go-to spot for the past 3 years. Always leave looking sharp.",
      date: "1 week ago",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? "text-[#C9A84C]" : "text-[#333333]"}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="testimonials" className="py-28 md:py-36 bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {/* Section Label */}
        <div className="flex items-center gap-5 mb-14 reveal">
          <div className="w-10 h-px bg-[#C9A84C]" />
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
            Testimonials
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-light italic text-[#F5F5F5] mb-16 reveal">
          What Our Clients Say
        </h2>

        {/* Carousel Container */}
        <div className="relative reveal">
          {/* Testimonial Card */}
          <div className="relative min-h-[300px] md:min-h-[250px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentIndex
                    ? "opacity-100 translate-x-0"
                    : index < currentIndex
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div className="border border-[#222222] p-8 md:p-12 bg-[#0A0A0A]">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">{renderStars(testimonial.rating)}</div>

                  {/* Quote */}
                  <blockquote className="font-display text-xl md:text-2xl font-light text-[#F5F5F5] leading-relaxed mb-8 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center justify-between border-t border-[#222222] pt-6">
                    <div>
                      <p className="font-display text-sm text-[#F5F5F5] tracking-wide mb-1">
                        {testimonial.name}
                      </p>
                      <p className="font-display text-xs text-[#888888] tracking-wide">
                        {testimonial.service}
                      </p>
                    </div>
                    <p className="font-display text-xs text-[#666666] tracking-wide">
                      {testimonial.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <span className="text-xl">←</span>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2 h-2 transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#C9A84C] w-8"
                      : "bg-[#333333] hover:bg-[#666666]"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* Review CTA */}
        <div className="mt-16 text-center reveal">
          <p className="font-display text-sm text-[#888888] tracking-wide mb-6">
            Had a great experience? Share your story
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.yelp.com/biz/international-styles"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[11px] tracking-[0.3em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
            >
              Review on Yelp
            </a>
            <a
              href="https://g.page/international-styles/review"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[11px] tracking-[0.3em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
            >
              Review on Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
