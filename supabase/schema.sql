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
-- NOTE: Run DROP/CREATE statements below in the Supabase SQL editor to apply RLS changes.
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
  );

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
