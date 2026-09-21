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
-- public anon key. The app selects an explicit column list (see
-- fetchSupabaseReviews) rather than "*", so this revoke does not break reads.
-- Applied via migration "revoke_anon_access_to_review_email".
-- ---------------------------------------------------------------------------
REVOKE SELECT (email) ON reviews FROM anon;

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

REVOKE ALL ON pending_reviews FROM anon;
GRANT SELECT ON pending_reviews TO authenticated, service_role;

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

-- SECURITY DEFINER bypasses RLS, so these must not be callable by anon.
REVOKE ALL ON FUNCTION approve_review(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION reject_review(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION approve_review(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION reject_review(uuid) TO authenticated, service_role;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample reviews for testing (optional)
INSERT INTO reviews (author, rating, text, source, verified) VALUES
  ('Michael R.', 5, 'Best barbershop in Jersey City! The attention to detail is incredible and the atmosphere is top-notch.', 'website', true),
  ('David L.', 5, 'Been coming here for years. Consistent quality, professional service, and always leave looking sharp.', 'website', true),
  ('James K.', 5, 'The fade I got here was absolutely perfect. These guys are true masters of their craft.', 'website', true)
ON CONFLICT DO NOTHING;
