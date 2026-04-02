/**
 * GET /api/reviews
 * Fetches all reviews from all sources (Google, Yelp, Supabase)
 */

import { NextResponse, type NextRequest } from "next/server";
import { getAllReviews, getReviewsByRating, getReviewStats } from "@/lib/reviews";

// This handler reads search params from the incoming request, so it must stay
// dynamic. The individual upstream fetches are still cached in src/lib/reviews.ts.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const minRating = searchParams.get("minRating");
    const stats = searchParams.get("stats");

    // If stats requested, return review statistics
    if (stats === "true") {
      const reviewStats = await getReviewStats();
      return NextResponse.json(reviewStats);
    }

    // If minRating filter provided, validate and get filtered reviews
    if (minRating) {
      const rating = parseInt(minRating, 10);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: "minRating must be between 1 and 5" },
          { status: 400 }
        );
      }
      const reviews = await getReviewsByRating(rating);
      return NextResponse.json(reviews);
    }

    // Otherwise, get all reviews
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
