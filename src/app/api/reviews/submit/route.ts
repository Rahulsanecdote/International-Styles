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

// Drop expired entries so the map doesn't grow without bound across the
// lifetime of a warm instance (one entry per distinct IP, forever, otherwise).
function pruneExpired(now: number): void {
  for (const [key, entry] of rateLimitMap) {
    if (now >= entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneExpired(now);

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

    // Validate required fields. Check types explicitly — a non-string author or
    // text, or a non-numeric rating, would otherwise slip past the comparisons
    // below and fail at the database as a 500 instead of a clean 400.
    if (
      typeof body.author !== "string" ||
      typeof body.text !== "string" ||
      !body.author.trim() ||
      !body.text.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields: author, text, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating: must be a whole number from 1 to 5. `typeof true < 1` and
    // `typeof {} > 5` are both false, so a bare range check accepts them.
    if (
      typeof body.rating !== "number" ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return NextResponse.json(
        { error: "Rating must be a whole number between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate email format (when provided)
    if (body.email !== undefined && body.email !== null && body.email !== "") {
      if (typeof body.email !== "string" || !EMAIL_RE.test(body.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
      if (body.email.length > 254) {
        return NextResponse.json(
          { error: "Email must not exceed 254 characters" },
          { status: 400 }
        );
      }
    }

    // Sanitize text inputs — strip HTML tags
    const author = stripHtml(body.author);
    const text = stripHtml(body.text);

    // Re-validate lengths after stripping (HTML tags could pad length)
    if (!author) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (author.length > 100) {
      return NextResponse.json(
        { error: "Name must not exceed 100 characters" },
        { status: 400 }
      );
    }

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
      email: typeof body.email === "string" && body.email ? body.email : undefined,
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
