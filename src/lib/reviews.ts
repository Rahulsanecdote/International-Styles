/**
 * Unified Review Fetcher
 * Aggregates reviews from multiple sources: Google Places, Yelp, Booksy, and Supabase
 */

import { createHash } from "node:crypto";
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

// Typed shape of a row returned from Supabase
interface SupabaseReviewRow {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: Review["source"];
  verified: boolean;
  created_at: string;
}

// Shape for inserting a review row into Supabase
interface ReviewInsert {
  author: string;
  email?: string;
  rating: number;
  text: string;
  source: string;
  verified: boolean;
}

// Typed shape of a Google Places review
interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

// Typed shape of a Yelp review
interface YelpReview {
  id: string;
  user: { name: string };
  rating: number;
  text: string;
  time_created: string;
}

interface BooksyApiReview {
  id: number | string;
  rank?: number;
  review?: string;
  title?: string;
  verified?: boolean;
  created?: string;
  updated?: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
}

interface BooksyApiResponse {
  reviews?: BooksyApiReview[];
  reviews_count?: number;
  filtered_reviews_count?: number;
  reviews_page?: number;
  reviews_per_page?: number;
}

// Shape for Booksy JSON-LD data embedded in the public business page
interface BooksyBusinessSchema {
  url?: string;
  aggregateRating?: {
    ratingValue?: number | string;
    reviewCount?: number | string;
  };
  review?: Array<{
    author?: { name?: string };
    datePublished?: string;
    reviewBody?: string;
    reviewRating?: {
      ratingValue?: number | string;
    };
  }>;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: ReturnType<typeof createClient> | null = null;

const DEFAULT_BOOKSY_PROFILE_URL =
  "https://booksy.com/en-us/7016_international-styles-barbershop_barber-shop_28561_jersey-city";
const DEFAULT_BOOKSY_PUBLIC_API_KEY = "web-e3d812bf-d7a2-445d-ab38-55589ae6a121";
const BOOKSY_API_PAGE_SIZE = 1000;
const BOOKSY_API_VERSION_CANDIDATES = [2, 3, 1];
const BOOKSY_REQUEST_HEADERS = {
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
};

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

/** Fetch with a 5-second abort timeout */
function fetchWithTimeout(
  url: string,
  options: RequestInit & { next?: { revalidate: number } }
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timeoutId)
  );
}

function decodeHtmlEntities(value: string): string {
  const namedEntityMap: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/&([a-z]+);/gi, (match, entity: string) => {
      const decoded = namedEntityMap[entity.toLowerCase()];
      return decoded ?? match;
    })
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    );
}

function stripHtml(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<!---->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  ).trim();
}

function createBooksyReviewId(author: string, createdAt: string, text: string): string {
  return `booksy-${createHash("sha1")
    .update(`${author}|${createdAt}|${text}`)
    .digest("hex")
    .slice(0, 12)}`;
}

function extractBooksyBusinessId(profileUrl: string): string | null {
  try {
    const pathSegments = new URL(profileUrl).pathname.split("/").filter(Boolean);
    const businessSegment = pathSegments.at(-1) || "";
    const businessMatch = businessSegment.match(/^(\d+)_/);
    return businessMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

function extractBooksyCountryCode(profileUrl: string): string {
  try {
    const { host, pathname } = new URL(profileUrl);
    const subdomain = host.split(".")[0]?.toLowerCase();
    if (subdomain && subdomain !== "booksy" && subdomain !== "www") {
      return subdomain;
    }

    const localeSegment = pathname.split("/").filter(Boolean)[0] || "";
    const localeMatch = localeSegment.match(/^[a-z]{2}-([a-z]{2})$/i);
    return localeMatch?.[1]?.toLowerCase() ?? "us";
  } catch {
    return "us";
  }
}

function extractBooksyApiKey(html: string): string | null {
  const apiKeyMatch = html.match(/apiKey:"([^"]+)"/);
  return apiKeyMatch ? decodeHtmlEntities(apiKeyMatch[1]) : null;
}

function buildBooksyMatchKey(createdAt: string, text: string): string {
  return `${createdAt.slice(0, 10)}::${text.toLowerCase()}`;
}

function parseBooksyDate(value: string): string | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function extractBooksySchema(html: string): BooksyBusinessSchema | null {
  const jsonLdPattern =
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(jsonLdPattern)) {
    try {
      const parsed = JSON.parse(match[1]) as BooksyBusinessSchema;
      if (parsed.url?.includes("booksy.com")) {
        return parsed;
      }
    } catch {
      // Ignore non-JSON-LD scripts and keep scanning.
    }
  }

  return null;
}

function mapBooksyReview(
  author: string,
  rating: number,
  text: string,
  createdAt: string
): Review {
  return {
    id: createBooksyReviewId(author, createdAt, text),
    author,
    rating,
    text,
    source: "booksy",
    verified: true,
    createdAt,
  };
}

function mapBooksyApiReview(review: BooksyApiReview): Review[] {
  const author = stripHtml(
    [review.user?.first_name, review.user?.last_name].filter(Boolean).join(" ")
  );
  const text = stripHtml(review.review || review.title || "");
  const createdAt = parseBooksyDate(review.created || review.updated || "");
  const rating = Number(review.rank);

  if (!text || !createdAt || Number.isNaN(rating)) {
    return [];
  }

  return [
    {
      id: `booksy-${review.id}`,
      author: author || "Booksy Customer",
      rating,
      text,
      source: "booksy",
      verified: review.verified !== false,
      createdAt,
    },
  ];
}

function parseBooksyStructuredReviews(schema: BooksyBusinessSchema | null): Review[] {
  if (!schema?.review) {
    return [];
  }

  return schema.review.flatMap((review) => {
    const author = stripHtml(review.author?.name || "");
    const text = stripHtml(review.reviewBody || "");
    const createdAt = parseBooksyDate(review.datePublished || "");
    const rating = Number(review.reviewRating?.ratingValue);

    if (!author || !text || !createdAt || Number.isNaN(rating)) {
      return [];
    }

    return [mapBooksyReview(author, rating, text, createdAt)];
  });
}

function parseBooksyReviewCards(
  html: string,
  ratingLookup: Map<string, number>
): Review[] {
  const reviewBlocks =
    html.match(
      /<div data-testid="review-item"[\s\S]*?(?=<div><div data-testid="review-item"|<div data-testid="paginator"|<\/body>)/g
    ) || [];

  return reviewBlocks.flatMap((block) => {
    const authorMatch = block.match(
      /data-testid="review-author"[^>]*>\s*([\s\S]*?)\s*<\/span>/i
    );
    const dateMatch = block.match(
      /data-testid="review-date"[^>]*>\s*([\s\S]*?)\s*<\/span>/i
    );
    const textMatch = block.match(
      /data-testid="review-body">\s*<span>([\s\S]*?)<\/span>\s*<\/div>/i
    );

    if (!authorMatch || !dateMatch || !textMatch) {
      return [];
    }

    const author = stripHtml(authorMatch[1]);
    const text = stripHtml(textMatch[1]);
    const createdAt = parseBooksyDate(stripHtml(dateMatch[1]));

    if (!author || !text || !createdAt) {
      return [];
    }

    const rating = ratingLookup.get(buildBooksyMatchKey(createdAt, text)) ?? 5;
    return [mapBooksyReview(author, rating, text, createdAt)];
  });
}

function dedupeReviews(reviews: Review[]): Review[] {
  const unique = new Map<string, Review>();

  for (const review of reviews) {
    const key = `${review.source}:${review.id}`;
    if (!unique.has(key)) {
      unique.set(key, review);
    }
  }

  return Array.from(unique.values());
}

function buildBooksyApiUrl(
  countryCode: string,
  apiVersion: number,
  businessId: string,
  page: number,
  perPage: number
): string {
  const params = new URLSearchParams({
    reviews_page: String(page),
    reviews_per_page: String(perPage),
  });

  return `https://${countryCode}.booksy.com/api/${countryCode}/${apiVersion}/customer_api/businesses/${businessId}/reviews/?${params.toString()}`;
}

async function fetchBooksyApiPage(options: {
  apiKey: string;
  apiVersion: number;
  businessId: string;
  countryCode: string;
  page: number;
  perPage: number;
  profileUrl: string;
}): Promise<BooksyApiResponse> {
  const response = await fetchWithTimeout(
    buildBooksyApiUrl(
      options.countryCode,
      options.apiVersion,
      options.businessId,
      options.page,
      options.perPage
    ),
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": BOOKSY_REQUEST_HEADERS["Accept-Language"],
        Referer: options.profileUrl,
        "User-Agent": BOOKSY_REQUEST_HEADERS["User-Agent"],
        "X-Api-Key": options.apiKey,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Booksy API page ${options.page} (v${options.apiVersion}, ${response.status})`
    );
  }

  return (await response.json()) as BooksyApiResponse;
}

async function fetchBooksyApiReviews(options: {
  apiKey: string;
  businessId: string;
  countryCode: string;
  profileUrl: string;
}): Promise<Review[]> {
  let lastError: Error | null = null;

  for (const apiVersion of BOOKSY_API_VERSION_CANDIDATES) {
    try {
      const firstPage = await fetchBooksyApiPage({
        ...options,
        apiVersion,
        page: 1,
        perPage: BOOKSY_API_PAGE_SIZE,
      });
      const totalExpected = Math.max(
        firstPage.filtered_reviews_count ?? 0,
        firstPage.reviews_count ?? 0,
        firstPage.reviews?.length ?? 0
      );
      const perPage = Math.max(firstPage.reviews_per_page || 0, 1);
      const totalPages = Math.max(Math.ceil(totalExpected / perPage), 1);
      const pages: BooksyApiResponse[] = [firstPage];

      for (let page = 2; page <= totalPages; page += 1) {
        pages.push(
          await fetchBooksyApiPage({
            ...options,
            apiVersion,
            page,
            perPage,
          })
        );
      }

      return dedupeReviews(
        pages
          .flatMap((page) => page.reviews || [])
          .flatMap((review) => mapBooksyApiReview(review))
      );
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error(`Unknown Booksy API error: ${String(error)}`);
    }
  }

  throw lastError || new Error("Failed to fetch Booksy API reviews");
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

    return (data || []).map((review: SupabaseReviewRow) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      text: review.text,
      source: review.source,
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
    const response = await fetchWithTimeout(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) throw new Error("Failed to fetch Google reviews");

    const data = await response.json();

    if (!data.result?.reviews) return [];

    return data.result.reviews.map((review: GoogleReview, index: number) => ({
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
    const response = await fetchWithTimeout(
      `https://api.yelp.com/v3/businesses/${businessId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch Yelp reviews");

    const data = await response.json();

    if (!data.reviews) return [];

    return data.reviews.map((review: YelpReview) => ({
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
 * Fetch Booksy reviews from Booksy's public reviews API.
 * Falls back to the public profile HTML if Booksy changes the API key or path.
 */
async function fetchBooksyReviews(): Promise<Review[]> {
  const profileUrl =
    process.env.NEXT_PUBLIC_BOOKSY_PROFILE_URL || DEFAULT_BOOKSY_PROFILE_URL;
  const businessId =
    process.env.NEXT_PUBLIC_BOOKSY_BUSINESS_ID ||
    extractBooksyBusinessId(profileUrl);
  const countryCode = extractBooksyCountryCode(profileUrl);

  try {
    if (!businessId) {
      throw new Error("Booksy business ID is not configured");
    }

    try {
      return await fetchBooksyApiReviews({
        apiKey: DEFAULT_BOOKSY_PUBLIC_API_KEY,
        businessId,
        countryCode,
        profileUrl,
      });
    } catch (error) {
      console.warn(
        "Booksy API fetch failed with cached key, retrying from profile page",
        error
      );
    }

    const response = await fetchWithTimeout(profileUrl, {
      headers: BOOKSY_REQUEST_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Booksy profile (${response.status})`);
    }

    const html = await response.text();
    const apiKey = extractBooksyApiKey(html);

    if (apiKey) {
      return await fetchBooksyApiReviews({
        apiKey,
        businessId,
        countryCode,
        profileUrl,
      });
    }

    const structuredReviews = parseBooksyStructuredReviews(
      extractBooksySchema(html)
    );
    const ratingLookup = new Map(
      structuredReviews.map((review) => [
        buildBooksyMatchKey(review.createdAt, review.text),
        review.rating,
      ])
    );
    const pageReviews = parseBooksyReviewCards(html, ratingLookup);

    return dedupeReviews(
      pageReviews.length > 0 ? pageReviews : structuredReviews
    );
  } catch (error) {
    console.error("Error fetching Booksy reviews:", error);
    return [];
  }
}

/**
 * Fetch all reviews from all sources and combine them
 */
export async function getAllReviews(): Promise<Review[]> {
  try {
    // Fetch from all sources in parallel
    const [googleReviews, yelpReviews, booksyReviews, supabaseReviews] =
      await Promise.all([
      fetchGoogleReviews(),
      fetchYelpReviews(),
      fetchBooksyReviews(),
      fetchSupabaseReviews(),
      ]);

    // Combine all reviews
    const allReviews = [
      ...googleReviews,
      ...yelpReviews,
      ...booksyReviews,
      ...supabaseReviews,
    ];

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
    const row: ReviewInsert = {
      author: review.author,
      email: review.email,
      rating: review.rating,
      text: review.text,
      source: "website",
      verified: false,
    };
    // Supabase JS without generated DB types resolves Insert to `never`.
    // The typed ReviewInsert above ensures correctness; the cast is safe.
    const { error } = await supabase
      .from("reviews")
      .insert([row] as never);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
}
