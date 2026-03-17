/**
 * POST /api/reviews/submit
 * Submits a new review to Supabase
 */

import { NextResponse } from "next/server";
import { submitReview } from "@/lib/reviews";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.author || !body.text || !body.rating) {
      return NextResponse.json(
        { error: "Missing required fields: author, text, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate text length
    if (body.text.length < 10) {
      return NextResponse.json(
        { error: "Review must be at least 10 characters long" },
        { status: 400 }
      );
    }

    if (body.text.length > 1000) {
      return NextResponse.json(
        { error: "Review must not exceed 1000 characters" },
        { status: 400 }
      );
    }

    // Submit the review
    const result = await submitReview({
      author: body.author,
      email: body.email,
      rating: body.rating,
      text: body.text,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to submit review" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Review submitted successfully! It will appear after verification." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/reviews/submit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
