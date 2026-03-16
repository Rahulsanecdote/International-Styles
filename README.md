# 🪒 International Styles Barber Shop

A premium, production-ready website for **International Styles Barber Shop** (Est. 2001). Built with Next.js 14, featuring a sophisticated dark/gold minimalist design system with film grain texture, scroll reveal animations, and online booking integration.

---

## 🎯 Project Overview

| Field            | Detail                                      |
|------------------|---------------------------------------------|
| **Client**       | International Styles Barber Shop            |
| **Domain**       | jcbarbers.com                               |
| **Audience**     | Males, all ages, minimalist aesthetic       |
| **Primary Goal** | Online bookings via Cal.com                 |
| **Founded**      | 2001                                        |
| **Build Cost**   | ~$0/month (Vercel free tier + Cal.com free) |

---

## 🛠️ Tech Stack

| Layer       | Technology                      | Version |
|-------------|---------------------------------|---------|
| Framework   | Next.js (App Router)            | 14.2.5  |
| Styling     | Tailwind CSS                    | ^3.4.1  |
| Language    | TypeScript                      | ^5      |
| Fonts       | Cormorant Garamond + Raleway    | Google  |
| Booking     | Cal.com inline embed            | Latest  |
| Hosting     | Vercel                          | Free    |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/international-styles.git
   cd international-styles
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Cal.com username:
   ```env
   NEXT_PUBLIC_CAL_USERNAME=your-cal-username
   ```

4. **Add logo**
   - Place `logo.png` in the `/public` directory
   - Recommended size: 512x512px, transparent PNG

5. **Update client information** (see checklist below)

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

7. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## ✅ Pre-Launch Checklist

### 🔴 **REQUIRED** - Must complete before launch:

- [ ] **Logo**: Drop `logo.png` into `/public/` directory
- [ ] **Address**: Update in `src/components/Hours.tsx` (search for "TODO")
- [ ] **Phone Number**: Update in:
  - `src/components/Hours.tsx`
  - `src/components/Booking.tsx`
  - `src/components/Footer.tsx`
- [ ] **Email**: Update in:
  - `src/components/Hours.tsx`
  - `src/components/Footer.tsx`
- [ ] **Cal.com Username**:
  1. Sign up at [cal.com](https://cal.com)
  2. Set username in `.env.local`
- [ ] **Google Maps Link**: Update in `src/components/Hours.tsx`
- [ ] **Social Media Links**: Update in `src/components/Footer.tsx`:
  - Instagram handle
  - Yelp business URL
  - Google Business URL

---

## 🎨 Design System

### Color Palette
```css
Background:    #0A0A0A   /* Near-black base */
Surface:       #111111   /* Card/section backgrounds */
Surface Alt:   #0D0D0D   /* Alternating sections */
Border:        #222222   /* Subtle dividers */
Text Primary:  #F5F5F5   /* Off-white headings */
Text Muted:    #888888   /* Body copy, labels */
Gold:          #C9A84C   /* THE only accent color */
Gold Light:    #E8C96A   /* Hover states */
Gold Dark:     #A07830   /* Pressed states */
```

### Typography
- **Display**: Cormorant Garamond (headings, hero text, prices)
- **Body**: Raleway (nav, labels, body copy, buttons)
- **Special Effects**: Tracking `0.2em–0.45em` uppercase for labels

### Key Features
- ✨ Film grain texture overlay
- 🎬 Scroll reveal animations with IntersectionObserver
- 📱 Fully responsive mobile navigation
- 🎨 Custom gold scrollbar
- 🖱️ No shadows, no rounded corners, no gradients
- ⚡ Performance-optimized fonts with `next/font`

---

## 📁 Project Structure

```
international-styles/
├── public/
│   └── logo.png                  # Client logo (add this!)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Fonts, metadata, ScrollRevealProvider
│   │   ├── page.tsx              # Page assembly
│   │   └── globals.css           # Base styles, grain texture, animations
│   ├── components/
│   │   ├── Nav.tsx               # Fixed nav with scroll effects
│   │   ├── Hero.tsx              # Full-screen hero
│   │   ├── Services.tsx          # Services & pricing
│   │   ├── Hours.tsx             # Hours + location
│   │   ├── Booking.tsx           # Cal.com embed
│   │   ├── Footer.tsx            # Footer with CTAs
│   │   └── ScrollRevealProvider.tsx
│   └── hooks/
│       └── useScrollReveal.ts    # IntersectionObserver hook
├── .env.example
├── tailwind.config.ts
└── README.md
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `NEXT_PUBLIC_CAL_USERNAME`
   - Deploy!

3. **Configure Custom Domain**
   - In Vercel dashboard, go to Settings → Domains
   - Add `jcbarbers.com`
   - Update DNS records (Vercel provides instructions)
   - SSL is automatically provisioned

---

## 🔮 Phase V1 (Future Enhancements)

- [ ] **Gallery Section** - Grid of client work photos with lightbox
- [ ] **Testimonials Section** - Carousel of customer reviews
- [ ] **About Section** - Barber story + team bios
- [ ] **Framer Motion** - Enhanced scroll animations
- [ ] **SEO Enhancements**:
  - `robots.txt`
  - `sitemap.xml`
  - Google LocalBusiness schema markup
- [ ] **Google Reviews API** - Auto-fetch and display reviews
- [ ] **Instagram Feed** - Embed recent posts
- [ ] **Cloudinary Integration** - Optimized image delivery

---

## 🎯 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 📝 Component Authoring Guidelines

When building NEW components:

1. **Always use `"use client"` directive** for components with state/effects
2. **Section structure**:
   - Section label: `[gold line] [uppercase gold tracking text]`
   - Heading: `font-display text-5xl font-light italic`
   - Add `.reveal` class for scroll animations
3. **Button pattern**:
   ```tsx
   className="font-body text-[11px] tracking-[0.3em] uppercase px-10 py-4 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500"
   ```
4. **Never use**: rounded corners, box shadows, gradients (except hero radial glow)
5. **Images**: Always use `next/image` with explicit dimensions
6. **Links**: Internal = `next/link`, External = `target="_blank" rel="noopener noreferrer"`

---

## 🐛 Troubleshooting

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

### Cal.com Not Loading
- Verify `NEXT_PUBLIC_CAL_USERNAME` is set correctly
- Check browser console for script loading errors
- Ensure Cal.com username exists and has availability set

### Scroll Animations Not Working
- Verify `ScrollRevealProvider` is wrapping children in `layout.tsx`
- Check elements have `.reveal` class applied
- Test in production build (some animations may not work in dev mode)

---

## 📄 License

© 2026 International Styles Barber Shop. All rights reserved.

---

## 🤝 Support

For technical issues or questions, please contact the development team.

---

**Built with ❤️ using Next.js 14 and Tailwind CSS**
