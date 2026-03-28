/**
 * POST /api/reviews/submit
 * Submits a new review to Supabase
 */

import { NextResponse } from "next/server";
import { submitReview } from "@/lib/reviews";

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 5 submissions per IP per hour.
// Resets on serverless cold start — acceptable at this scale.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: Request) {
  try {
    // --- Rate limiting ---
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

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

    // Validate email format (when provided)
    if (body.email && !EMAIL_RE.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize text inputs — strip HTML tags
    const author = stripHtml(String(body.author));
    const text = stripHtml(String(body.text));

    // Re-validate lengths after stripping (HTML tags could pad length)
    if (text.length < 10) {
      return NextResponse.json(
        { error: "Review must be at least 10 characters long" },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: "Review must not exceed 1000 characters" },
        { status: 400 }
      );
    }

    // Submit the review
    const result = await submitReview({
      author,
      email: body.email,
      rating: body.rating,
      text,
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
