/**
 * GET /api/reviews
 * Fetches all reviews from all sources (Google, Yelp, Supabase)
 */

import { NextResponse } from "next/server";
import { getAllReviews, getReviewsByRating, getReviewStats } from "@/lib/reviews";

export const dynamic = "force-dynamic"; // Disable caching for fresh reviews

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minRating = searchParams.get("minRating");
    const stats = searchParams.get("stats");

    // If stats requested, return review statistics
    if (stats === "true") {
      const reviewStats = await getReviewStats();
      return NextResponse.json(reviewStats);
    }

    // If minRating filter provided, get filtered reviews
    if (minRating) {
      const reviews = await getReviewsByRating(parseInt(minRating));
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
