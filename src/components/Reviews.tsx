"use client";

import { useEffect, useState } from "react";
import ReviewsCarousel from "./ReviewsCarousel";
import ReviewSubmitForm from "./ReviewSubmitForm";
import type { Review } from "@/lib/reviews";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    averageRating: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews?minRating=4");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/reviews?stats=true");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleReviewSuccess = () => {
    setShowSubmitForm(false);
    // Optionally refresh reviews
    fetchReviews();
    fetchStats();
  };

  return (
    <section id="reviews" className="py-24 md:py-32 bg-[#0A0A0A] reveal">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] font-body text-sm uppercase tracking-[0.2em] mb-4">
            Client Reviews
          </p>
          <h2 className="font-display text-5xl md:text-7xl font-light italic text-[#F5F5F5] mb-6">
            What Our Clients Say
          </h2>
          {stats && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <div>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <span className="font-display text-4xl text-[#C9A84C] italic">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(stats.averageRating)
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
                </div>
                <p className="text-[#666666] font-body text-sm">
                  Based on {stats.total} review{stats.total !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Carousel */}
        {hasError ? (
          <p className="text-center text-[#666666] font-body py-12">
            Unable to load reviews. Please try again later.
          </p>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#666666] font-body mt-4">Loading reviews...</p>
          </div>
        ) : (
          <ReviewsCarousel reviews={reviews} />
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 font-body text-sm uppercase tracking-wider hover:bg-[#E8C96A] transition-all"
          >
            {showSubmitForm ? "Hide Form" : "Write a Review"}
          </button>
          <a
            href="/reviews"
            className="border border-[#C9A84C] text-[#C9A84C] px-8 py-4 font-body text-sm uppercase tracking-wider hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
          >
            View All Reviews
          </a>
        </div>

        {/* Submit Form */}
        {showSubmitForm && (
          <div className="mt-16 max-w-2xl mx-auto bg-[#111111] border border-[#222222] p-8 md:p-12">
            <ReviewSubmitForm onSuccess={handleReviewSuccess} />
          </div>
        )}
      </div>
    </section>
  );
}
