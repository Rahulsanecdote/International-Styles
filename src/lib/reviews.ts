/**
 * Unified Review Fetcher
 * Aggregates reviews from multiple sources: Google Places, Yelp, and Supabase
 */

import { createClient } from "@supabase/supabase-js";

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: "google" | "yelp" | "booksy" | "website";
  verified: boolean;
  createdAt: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Fetch reviews from Supabase
 */
async function fetchSupabaseReviews(): Promise<Review[]> {
  if (!supabase) {
    console.warn("Supabase not configured, skipping Supabase reviews");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((review: any) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      text: review.text,
      source: review.source as Review["source"],
      verified: review.verified,
      createdAt: review.created_at,
    }));
  } catch (error) {
    console.error("Error fetching Supabase reviews:", error);
    return [];
  }
}

/**
 * Fetch reviews from Google Places API
 */
async function fetchGoogleReviews(): Promise<Review[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_ID;

  if (!apiKey || !placeId) {
    console.warn("Google Places API not configured, skipping Google reviews");
    return [];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) throw new Error("Failed to fetch Google reviews");

    const data = await response.json();

    if (!data.result?.reviews) return [];

    return data.result.reviews.map((review: any, index: number) => ({
      id: `google-${index}`,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      source: "google" as const,
      verified: true,
      createdAt: new Date(review.time * 1000).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return [];
  }
}

/**
 * Fetch reviews from Yelp Fusion API
 */
async function fetchYelpReviews(): Promise<Review[]> {
  const apiKey = process.env.YELP_API_KEY;
  const businessId = process.env.YELP_BUSINESS_ID;

  if (!apiKey || !businessId) {
    console.warn("Yelp API not configured, skipping Yelp reviews");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${businessId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) throw new Error("Failed to fetch Yelp reviews");

    const data = await response.json();

    if (!data.reviews) return [];

    return data.reviews.map((review: any) => ({
      id: review.id,
      author: review.user.name,
      rating: review.rating,
      text: review.text,
      source: "yelp" as const,
      verified: true,
      createdAt: review.time_created,
    }));
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
    return [];
  }
}

/**
 * Fetch all reviews from all sources and combine them
 */
export async function getAllReviews(): Promise<Review[]> {
  try {
    // Fetch from all sources in parallel
    const [googleReviews, yelpReviews, supabaseReviews] = await Promise.all([
      fetchGoogleReviews(),
      fetchYelpReviews(),
      fetchSupabaseReviews(),
    ]);

    // Combine all reviews
    const allReviews = [...googleReviews, ...yelpReviews, ...supabaseReviews];

    // Sort by date (newest first)
    allReviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return allReviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

/**
 * Get reviews by rating filter
 */
export async function getReviewsByRating(
  minRating: number = 1
): Promise<Review[]> {
  const allReviews = await getAllReviews();
  return allReviews.filter((review) => review.rating >= minRating);
}

/**
 * Get reviews by source
 */
export async function getReviewsBySource(
  source: Review["source"]
): Promise<Review[]> {
  const allReviews = await getAllReviews();
  return allReviews.filter((review) => review.source === source);
}

/**
 * Get featured reviews (5-star reviews only)
 */
export async function getFeaturedReviews(limit: number = 10): Promise<Review[]> {
  const allReviews = await getAllReviews();
  return allReviews.filter((review) => review.rating === 5).slice(0, limit);
}

/**
 * Calculate average rating from all reviews
 */
export async function getAverageRating(): Promise<number> {
  const allReviews = await getAllReviews();
  if (allReviews.length === 0) return 0;

  const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / allReviews.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Get review count by source
 */
export async function getReviewStats() {
  const allReviews = await getAllReviews();

  return {
    total: allReviews.length,
    google: allReviews.filter((r) => r.source === "google").length,
    yelp: allReviews.filter((r) => r.source === "yelp").length,
    booksy: allReviews.filter((r) => r.source === "booksy").length,
    website: allReviews.filter((r) => r.source === "website").length,
    averageRating: await getAverageRating(),
  };
}

/**
 * Submit a new review to Supabase
 */
export async function submitReview(review: {
  author: string;
  email?: string;
  rating: number;
  text: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: false,
      error: "Review system not configured",
    };
  }

  // Validate input
  if (!review.author || !review.text || !review.rating) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  if (review.rating < 1 || review.rating > 5) {
    return {
      success: false,
      error: "Rating must be between 1 and 5",
    };
  }

  if (review.text.length < 10) {
    return {
      success: false,
      error: "Review must be at least 10 characters",
    };
  }

  try {
    const { error } = await (supabase as any).from("reviews").insert([{
      author: review.author,
      email: review.email,
      rating: review.rating,
      text: review.text,
      source: "website",
      verified: false, // Reviews from website need verification
    }]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      error: error.message || "Failed to submit review",
    };
  }
}
