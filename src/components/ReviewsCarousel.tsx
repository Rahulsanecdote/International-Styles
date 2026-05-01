"use client";

import type { Review } from "@/lib/reviews";

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const marqueeReviews = reviews.slice(0, 18);

  // Duplicate once (2x) for seamless CSS loop — down from 3x with rAF
  const duplicatedReviews = [...marqueeReviews, ...marqueeReviews];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#F5F5F5] font-display">No reviews available yet.</p>
      </div>
    );
  }

  // Keep the homepage marquee readable and moving at a consistent pace.
  const durationSeconds = Math.max(
    45,
    Math.min(marqueeReviews.length * 5, 90)
  );

  return (
    <div className="relative overflow-hidden">
      {/* Inline keyframes — scoped to this component */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* Scrolling Container — pure CSS, GPU-accelerated */}
      <div
        className="flex gap-6 py-8"
        style={{
          animation: `marquee ${durationSeconds}s linear infinite`,
          willChange: "transform",
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <div
            key={`${review.id}-${index}`}
            className="flex-shrink-0 w-[260px] md:w-[380px] bg-[#111111] border border-[#222222] p-6 md:p-8 transition-all hover:border-[#C9A84C]/50"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? "fill-[#C9A84C] text-[#C9A84C]"
                      : "fill-none text-[#333333]"
                  }`}
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            {/* Review Text */}
            <p className="text-[#F5F5F5] font-display text-base leading-relaxed mb-6 line-clamp-4">
              &ldquo;{review.text}&rdquo;
            </p>

            {/* Author and Source */}
            <div className="flex items-center justify-between border-t border-[#222222] pt-4">
              <div>
                <p className="font-display text-lg text-[#F5F5F5] italic">
                  {review.author}
                </p>
                <p className="text-xs text-[#F5F5F5] uppercase tracking-wider font-display mt-1">
                  {review.source === "google" && "Google Reviews"}
                  {review.source === "yelp" && "Yelp"}
                  {review.source === "booksy" && "Booksy"}
                  {review.source === "website" && "Website"}
                  {review.verified && " • Verified"}
                </p>
              </div>

              {/* Source Icon */}
              <div className="w-8 h-8 flex items-center justify-center">
                {review.source === "google" && (
                  <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {review.source === "yelp" && (
                  <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
