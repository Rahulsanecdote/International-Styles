-- International Styles Barber Shop - Reviews Database Schema
-- This schema creates the reviews table for storing customer reviews

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS reviews_source_idx ON reviews(source);

-- Create index on rating for filtering
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public reads: verified reviews ONLY.
-- Website submissions are inserted with verified = false and stay invisible to
-- the public until a moderator sets verified = true. Do not add
-- "OR source = 'website'" here — that publishes unmoderated user text.
-- APPLIED to the live database via migration
-- "restrict_reviews_rls_to_verified_only". This file is the source of record;
-- it is not run automatically, so any change here needs a matching migration.
-- DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
-- DROP POLICY IF EXISTS "Anyone can read verified reviews" ON reviews;
CREATE POLICY "Anyone can read verified reviews" ON reviews
  FOR SELECT USING (verified = true);

-- Inserts: require non-empty author/text and valid rating at the database level (belt-and-suspenders with API validation).
-- The anon key is public (NEXT_PUBLIC_*), so anyone can call Supabase directly
-- without going through /api/reviews/submit. These checks pin verified = false
-- and source = 'website' so a direct insert cannot self-publish.
-- DROP POLICY IF EXISTS "Anyone can submit reviews" ON reviews;
CREATE POLICY "Anyone can submit reviews" ON reviews
  FOR INSERT WITH CHECK (
    author IS NOT NULL AND length(trim(author)) > 0 AND length(author) <= 100
    AND text IS NOT NULL AND length(trim(text)) >= 10 AND length(text) <= 1000
    AND rating >= 1 AND rating <= 5
    AND verified = false
    AND source = 'website'
    AND (email IS NULL OR length(email) <= 254)
  );

-- No UPDATE or DELETE policy exists, so the public anon key cannot modify or
-- remove rows. Moderation goes through the SECURITY DEFINER helpers below.

-- ---------------------------------------------------------------------------
-- Column privileges: the submitter's email must never be readable with the
-- public anon key.
--
-- A column-level "REVOKE SELECT (email)" does NOT work here: in Postgres a
-- table-level SELECT grant implies every column, and Supabase grants anon and
-- authenticated full table privileges by default. The table grant has to be
-- dropped and replaced with an explicit column list. The app selects exactly
-- these columns (see fetchSupabaseReviews), so reads keep working.
--
-- email stays insertable but not selectable: write-only from the public key.
-- Applied via migration "narrow_anon_grants_on_reviews".
-- ---------------------------------------------------------------------------
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON reviews FROM anon;
GRANT SELECT (id, author, rating, text, source, verified, created_at)
  ON reviews TO anon;

REVOKE INSERT ON reviews FROM anon;
GRANT INSERT (author, email, rating, text, source, verified)
  ON reviews TO anon;

REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON reviews FROM authenticated;
GRANT SELECT (id, author, rating, text, source, verified, created_at)
  ON reviews TO authenticated;

-- ---------------------------------------------------------------------------
-- Moderation helpers. Submissions land with verified = false and are invisible
-- to the public, so without these a review could never appear at all.
-- Run from the Supabase SQL editor. Applied via migration
-- "add_review_moderation_helpers".
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW pending_reviews AS
  SELECT id, author, rating, text, email, created_at
  FROM reviews
  WHERE verified = false
  ORDER BY created_at DESC;

-- A view defaults to SECURITY DEFINER semantics: it runs with the creator's
-- rights and bypasses RLS for anyone allowed to read it. security_invoker
-- makes it respect the querying role instead. Supabase's linter flags the
-- default as an ERROR, and granting it to `authenticated` would have exposed
-- pending submissions and their emails to any signed-in user.
ALTER VIEW pending_reviews SET (security_invoker = on);

REVOKE ALL ON pending_reviews FROM anon, authenticated;
GRANT SELECT ON pending_reviews TO service_role;

CREATE OR REPLACE FUNCTION approve_review(review_id uuid)
RETURNS TABLE (id uuid, author text, verified boolean)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  UPDATE reviews SET verified = true, updated_at = timezone('utc', now())
  WHERE reviews.id = review_id
  RETURNING reviews.id, reviews.author, reviews.verified;
$$;

CREATE OR REPLACE FUNCTION reject_review(review_id uuid)
RETURNS TABLE (id uuid, author text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  DELETE FROM reviews WHERE reviews.id = review_id AND reviews.verified = false
  RETURNING reviews.id, reviews.author;
$$;

-- SECURITY DEFINER bypasses RLS, so these are restricted to service_role.
-- Moderation runs from the Supabase SQL editor / dashboard, which connects as
-- postgres or service_role; `authenticated` has no reason to reach them.
REVOKE ALL ON FUNCTION approve_review(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION reject_review(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION approve_review(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION reject_review(uuid) TO service_role;

-- ---------------------------------------------------------------------------
-- HOW TO MODERATE (Supabase dashboard -> SQL Editor)
--
--   -- see what is waiting
--   SELECT * FROM pending_reviews;
--
--   -- publish one
--   SELECT * FROM approve_review('<id from above>');
--
--   -- discard one (only works while it is still unverified)
--   SELECT * FROM reject_review('<id from above>');
--
-- The table editor's `verified` toggle does the same thing by hand.
-- ---------------------------------------------------------------------------

-- Create function to update the updated_at timestamp
-- search_path is pinned so a caller-controlled search_path cannot influence
-- what this resolves. Applied via migration "harden_moderation_helpers".
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- WARNING: placeholder testimonials, not real customers.
--
-- These three rows are seeded with verified = true, so they render on the live
-- site as though they were genuine customer reviews. They are currently the
-- ONLY reviews the site displays. Delete them once real reviews exist, and do
-- not re-run this block against production.
-- ---------------------------------------------------------------------------
INSERT INTO reviews (author, rating, text, source, verified) VALUES
  ('Michael R.', 5, 'Best barbershop in Jersey City! The attention to detail is incredible and the atmosphere is top-notch.', 'website', true),
  ('David L.', 5, 'Been coming here for years. Consistent quality, professional service, and always leave looking sharp.', 'website', true),
  ('James K.', 5, 'The fade I got here was absolutely perfect. These guys are true masters of their craft.', 'website', true)
ON CONFLICT DO NOTHING;
