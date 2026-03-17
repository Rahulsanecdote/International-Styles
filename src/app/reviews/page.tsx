"use client";

import { useEffect, useState, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReviewSubmitForm from "@/components/ReviewSubmitForm";
import type { Review } from "@/lib/reviews";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    google: number;
    yelp: number;
    booksy: number;
    website: number;
    averageRating: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | 1 | 2 | 3 | 4 | 5>("all");
  const [activeSource, setActiveSource] = useState<"all" | Review["source"]>("all");
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const filterReviews = useCallback(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (activeFilter !== "all") {
      filtered = filtered.filter((review) => review.rating === activeFilter);
    }

    // Filter by source
    if (activeSource !== "all") {
      filtered = filtered.filter((review) => review.source === activeSource);
    }

    setFilteredReviews(filtered);
  }, [reviews, activeFilter, activeSource]);

  useEffect(() => {
    fetchReviews();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterReviews();
  }, [filterReviews]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
    fetchReviews();
    fetchStats();
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0A0A0A] pt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Page Header */}
          <div className="text-center mb-16">
            <p className="text-[#C9A84C] font-body text-sm uppercase tracking-[0.2em] mb-4">
              Client Reviews
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-light italic text-[#F5F5F5] mb-6">
              All Reviews
            </h1>
            <p className="text-[#999999] font-body text-lg max-w-2xl mx-auto">
              Read what our clients have to say about their experience at International Styles
            </p>

            {/* Stats */}
            {stats && (
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pb-12 border-b border-[#222222]">
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <span className="font-display text-5xl text-[#C9A84C] italic">
                      {stats.averageRating.toFixed(1)}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-7 h-7 ${
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
                  <p className="text-[#666666] font-body text-sm">Average Rating</p>
                </div>

                <div className="h-16 w-px bg-[#222222]" />

                <div className="text-center">
                  <p className="font-display text-5xl text-[#F5F5F5] italic">
                    {stats.total}
                  </p>
                  <p className="text-[#666666] font-body text-sm mt-2">Total Reviews</p>
                </div>

                {(stats.google > 0 || stats.yelp > 0 || stats.booksy > 0) && (
                  <>
                    <div className="h-16 w-px bg-[#222222]" />
                    <div className="flex gap-6">
                      {stats.google > 0 && (
                        <div className="text-center">
                          <p className="font-body text-2xl text-[#C9A84C]">{stats.google}</p>
                          <p className="text-[#666666] font-body text-xs mt-1">Google</p>
                        </div>
                      )}
                      {stats.yelp > 0 && (
                        <div className="text-center">
                          <p className="font-body text-2xl text-[#C9A84C]">{stats.yelp}</p>
                          <p className="text-[#666666] font-body text-xs mt-1">Yelp</p>
                        </div>
                      )}
                      {stats.booksy > 0 && (
                        <div className="text-center">
                          <p className="font-body text-2xl text-[#C9A84C]">{stats.booksy}</p>
                          <p className="text-[#666666] font-body text-xs mt-1">Booksy</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mb-12 space-y-6">
            {/* Rating Filter */}
            <div>
              <p className="text-[#C9A84C] font-body text-sm uppercase tracking-wider mb-3">
                Filter by Rating
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
                    activeFilter === "all"
                      ? "bg-[#C9A84C] text-[#0A0A0A]"
                      : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                  }`}
                >
                  All Ratings
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setActiveFilter(rating as 1 | 2 | 3 | 4 | 5)}
                    className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeFilter === rating
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                    }`}
                  >
                    {rating} ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <p className="text-[#C9A84C] font-body text-sm uppercase tracking-wider mb-3">
                Filter by Source
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveSource("all")}
                  className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
                    activeSource === "all"
                      ? "bg-[#C9A84C] text-[#0A0A0A]"
                      : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                  }`}
                >
                  All Sources
                </button>
                {stats && stats.google > 0 && (
                  <button
                    onClick={() => setActiveSource("google")}
                    className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
                      activeSource === "google"
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                    }`}
                  >
                    Google ({stats.google})
                  </button>
                )}
                {stats && stats.yelp > 0 && (
                  <button
                    onClick={() => setActiveSource("yelp")}
                    className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
                      activeSource === "yelp"
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                    }`}
                  >
                    Yelp ({stats.yelp})
                  </button>
                )}
                {stats && stats.booksy > 0 && (
                  <button
                    onClick={() => setActiveSource("booksy")}
                    className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
                      activeSource === "booksy"
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                    }`}
                  >
                    Booksy ({stats.booksy})
                  </button>
                )}
                {stats && stats.website > 0 && (
                  <button
                    onClick={() => setActiveSource("website")}
                    className={`px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
                      activeSource === "website"
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#111111] text-[#C9A84C] border border-[#222222] hover:border-[#C9A84C]"
                    }`}
                  >
                    Website ({stats.website})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Review Button */}
          <div className="mb-12 text-center">
            <button
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 font-body text-sm uppercase tracking-wider hover:bg-[#E8C96A] transition-all"
            >
              {showSubmitForm ? "Hide Form" : "Write a Review"}
            </button>
          </div>

          {/* Submit Form */}
          {showSubmitForm && (
            <div className="mb-16 max-w-2xl mx-auto bg-[#111111] border border-[#222222] p-8 md:p-12">
              <ReviewSubmitForm onSuccess={handleReviewSuccess} />
            </div>
          )}

          {/* Reviews Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#666666] font-body mt-4">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20 border border-[#222222] bg-[#111111]">
              <p className="text-[#666666] font-body text-lg">
                No reviews found with the selected filters.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[#666666] font-body text-sm mb-6">
                Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#111111] border border-[#222222] p-6 hover:border-[#C9A84C]/50 transition-all"
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
                    <p className="text-[#CCCCCC] font-body text-sm leading-relaxed mb-4">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {/* Author and Source */}
                    <div className="border-t border-[#222222] pt-4">
                      <p className="font-display text-base text-[#F5F5F5] italic">
                        {review.author}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-[#666666] uppercase tracking-wider font-body">
                          {review.source === "google" && "Google Reviews"}
                          {review.source === "yelp" && "Yelp"}
                          {review.source === "booksy" && "Booksy"}
                          {review.source === "website" && "Website"}
                          {review.verified && " • Verified"}
                        </p>
                        <p className="text-xs text-[#666666] font-body">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
