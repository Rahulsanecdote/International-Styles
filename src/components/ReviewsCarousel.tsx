"use client";

import { useState, useRef, useEffect } from "react";
import type { Review } from "@/lib/reviews";

interface ReviewsCarouselProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "fill-[#C9A84C] text-[#C9A84C]" : "fill-none text-[#333333]"}`}
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function SourceLabel({ source, verified }: { source: Review["source"]; verified: boolean }) {
  const label =
    source === "google" ? "Google Reviews" :
    source === "yelp" ? "Yelp" :
    source === "booksy" ? "Booksy" : "Website";
  return (
    <p className="text-xs text-[#F5F5F5] uppercase tracking-wider font-display mt-1">
      {label}{verified && " • Verified"}
    </p>
  );
}

// Mobile swipeable carousel
function MobileCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % reviews.length);
    }, 4000);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [reviews.length]);

  const goTo = (i: number) => {
    setIndex(i);
    resetInterval();
  };

  const next = () => goTo((index + 1) % reviews.length);
  const prev = () => goTo((index - 1 + reviews.length) % reviews.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current ?? 0));
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const review = reviews[index];

  return (
    <div className="md:hidden">
      <div
        className="bg-[#111111] border border-[#222222] p-6 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <StarRating rating={review.rating} />
        <p className="text-[#F5F5F5] font-display text-base leading-relaxed mb-6">
          &ldquo;{review.text}&rdquo;
        </p>
        <div className="border-t border-[#222222] pt-4">
          <p className="font-display text-lg text-[#F5F5F5] italic">{review.author}</p>
          <SourceLabel source={review.source} verified={review.verified} />
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-[#C9A84C]" : "w-1.5 bg-[#444444]"
            }`}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>

      <p className="text-center text-[10px] text-[#F5F5F5]/40 font-display mt-3 tracking-[0.3em] uppercase">
        Swipe to browse · {index + 1} / {reviews.length}
      </p>
    </div>
  );
}

// Desktop CSS marquee
function DesktopMarquee({ reviews }: { reviews: Review[] }) {
  const marqueeReviews = reviews.slice(0, 18);
  const duplicated = [...marqueeReviews, ...marqueeReviews];
  const duration = Math.max(25, Math.min(marqueeReviews.length * 3, 50));

  return (
    <div className="hidden md:block relative overflow-hidden">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div
        className="flex gap-6 py-8"
        style={{ animation: `marquee ${duration}s linear infinite`, willChange: "transform" }}
      >
        {duplicated.map((review, i) => (
          <div
            key={`${review.id}-${i}`}
            className="flex-shrink-0 w-[380px] bg-[#111111] border border-[#222222] p-8 transition-all hover:border-[#C9A84C]/50"
          >
            <StarRating rating={review.rating} />
            <p className="text-[#F5F5F5] font-display text-base leading-relaxed mb-6 line-clamp-4">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center justify-between border-t border-[#222222] pt-4">
              <div>
                <p className="font-display text-lg text-[#F5F5F5] italic">{review.author}</p>
                <SourceLabel source={review.source} verified={review.verified} />
              </div>
              {review.source === "google" && (
                <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#F5F5F5] font-display">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <>
      <MobileCarousel reviews={reviews} />
      <DesktopMarquee reviews={reviews} />
    </>
  );
}
