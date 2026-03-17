# Supabase Setup Guide

This guide will walk you through setting up Supabase for the International Styles review system.

## Prerequisites

- A Supabase account (free tier works fine)
- Basic familiarity with SQL

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in with GitHub (or create an account)
3. Click **"New Project"**
4. Fill in the details:
   - **Name:** `international-styles` (or any name you prefer)
   - **Database Password:** Create a strong password (**SAVE THIS!**)
   - **Region:** `US East (N. Virginia)` (closest to Jersey City, NJ)
   - **Pricing Plan:** Free tier is sufficient for starting
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

### 2. Get Your API Credentials

1. Once the project is ready, click on **Settings** (⚙️ icon in sidebar)
2. Go to **API** section
3. Copy these two values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Database Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `/supabase/schema.sql` from this repository
4. Paste into the SQL Editor
5. Click **"Run"** (bottom right)
6. You should see: **"Success. No rows returned"**

This creates:
- ✅ `reviews` table with all necessary columns
- ✅ Indexes for optimized queries
- ✅ Row Level Security (RLS) policies
- ✅ Auto-updating timestamps
- ✅ 3 sample reviews for testing

### 4. Configure Local Environment

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```bash
# Line 9: Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co

# Line 10: Your Supabase Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your actual key)
```

3. Save the file

### 5. Restart Development Server

```bash
# Kill existing dev server
npm run dev
```

The server will automatically pick up the new environment variables.

## Verify Setup

### Test 1: View Sample Reviews

1. Open http://localhost:3000/#reviews
2. You should see 3 sample reviews in the carousel

### Test 2: Submit a Review

1. Click **"Write a Review"** button
2. Select 5 stars
3. Enter name and review text
4. Click **"Submit Review"**
5. Refresh the page - your review should appear

### Test 3: Check API Endpoints

Open these URLs in your browser:

- http://localhost:3000/api/reviews (should return JSON array of reviews)
- http://localhost:3000/api/reviews?stats=true (should return statistics)

### Test 4: Full Reviews Page

1. Go to http://localhost:3000/reviews
2. You should see all reviews in a grid
3. Test filtering by rating and source

## Database Schema

The `reviews` table structure:

| Column       | Type                      | Description                          |
|--------------|---------------------------|--------------------------------------|
| `id`         | UUID (Primary Key)        | Auto-generated unique identifier     |
| `author`     | TEXT                      | Review author name                   |
| `email`      | TEXT (nullable)           | Optional email address               |
| `rating`     | INTEGER (1-5)             | Star rating (validated)              |
| `text`       | TEXT                      | Review content                       |
| `source`     | TEXT                      | Review source (google/yelp/website)  |
| `verified`   | BOOLEAN                   | Verification status                  |
| `created_at` | TIMESTAMP WITH TIME ZONE  | Auto-generated creation timestamp    |
| `updated_at` | TIMESTAMP WITH TIME ZONE  | Auto-updated modification timestamp  |

## Security

### Row Level Security (RLS)

The database has RLS enabled with these policies:

1. **Read Access:** Anyone can read all reviews
2. **Write Access:** Anyone can insert reviews (validation happens in API layer)

Website submissions are marked as `verified: false` and can be manually approved in Supabase dashboard.

### Manual Review Approval

To approve a review:

1. Go to Supabase dashboard → **Table Editor**
2. Select the `reviews` table
3. Find the review you want to verify
4. Click to edit, set `verified` to `true`
5. Save

## Optional Integrations

### Google Places API (Optional)

To aggregate Google reviews:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Places API
3. Create API credentials
4. Add to `.env.local`:

```bash
GOOGLE_PLACES_API_KEY=your-google-api-key
GOOGLE_PLACES_ID=your-google-place-id
```

### Yelp Fusion API (Optional)

To aggregate Yelp reviews:

1. Go to [Yelp Developers](https://www.yelp.com/developers/v3/manage_app)
2. Create an app to get API key
3. Add to `.env.local`:

```bash
YELP_API_KEY=your-yelp-api-key
YELP_BUSINESS_ID=your-yelp-business-id
```

## Deployment to Vercel

When deploying to production:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
NEXT_PUBLIC_BOOKSY_BUSINESS_ID = your-booksy-id (if available)
```

3. Redeploy your application

## Troubleshooting

### "Review system not configured" error

**Solution:** Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`

### No reviews showing up

**Solution:**
1. Check that schema.sql ran successfully in Supabase
2. Verify your API credentials are correct
3. Check browser console for errors

### Reviews not submitting

**Solution:**
1. Check that RLS policies are enabled
2. Verify the API route is working: http://localhost:3000/api/reviews/submit
3. Check Supabase logs in dashboard

### Production build fails

**Solution:**
1. Make sure environment variables start with `NEXT_PUBLIC_` for client-side access
2. Restart dev server after changing `.env.local`

## Support

If you need help:

1. Check Supabase documentation: https://supabase.com/docs
2. Review the code in `/src/lib/reviews.ts` for API integration
3. Check browser console and server logs for specific errors

## Database Management

### View All Reviews

In Supabase dashboard:
1. Click **Table Editor** (left sidebar)
2. Select `reviews` table
3. View, edit, or delete reviews

### Export Reviews

```sql
SELECT * FROM reviews
ORDER BY created_at DESC;
```

Copy results from SQL Editor.

### Delete Test Data

```sql
DELETE FROM reviews WHERE source = 'website' AND verified = false;
```

## Next Steps

Once Supabase is working:

1. ✅ Test the review submission form
2. ✅ Customize review verification workflow
3. ✅ Add Booksy Business ID to enable booking widget
4. ✅ (Optional) Set up Google/Yelp API for review aggregation
5. ✅ Deploy to Vercel with environment variables

---

**All set!** Your review system is now fully functional with Supabase. 🎉
