import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import { BUSINESS } from "@/lib/config";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jcbarbers.com"),
  title: "International Styles Barber Shop | Premium Cuts Since 2001",
  description:
    "Experience timeless grooming at International Styles Barber Shop. Serving the community with precision haircuts, straight razor shaves, and classic barbering since 2001. Book your appointment online.",
  keywords: [
    "barber shop",
    "haircuts",
    "straight razor shave",
    "mens grooming",
    "classic barbering",
    "beard trim",
    "fade",
    "hot towel",
  ],
  authors: [{ name: "International Styles Barber Shop" }],
  creator: "International Styles Barber Shop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jcbarbers.com",
    siteName: "International Styles Barber Shop",
    title: "International Styles Barber Shop | Premium Cuts Since 2001",
    description:
      "Experience timeless grooming at International Styles Barber Shop. Serving the community with precision haircuts, straight razor shaves, and classic barbering since 2001.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "International Styles Barber Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "International Styles Barber Shop | Premium Cuts Since 2001",
    description:
      "Experience timeless grooming at International Styles Barber Shop. Serving the community with precision haircuts, straight razor shaves, and classic barbering since 2001.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for Google LocalBusiness
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": `${BUSINESS.name} Barber Shop`,
    "image": `${BUSINESS.url}/logo.png`,
    "url": BUSINESS.url,
    "telephone": BUSINESS.phoneFormatted,
    "email": BUSINESS.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS.address,
      "addressLocality": BUSINESS.city,
      "addressRegion": BUSINESS.state,
      "postalCode": BUSINESS.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.7178,
      "longitude": -74.0431
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "10:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card",
    "foundingDate": "2001",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    }
  };

  return (
    <html lang="en" className={cormorantGaramond.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <ScrollRevealProvider>{children}</ScrollRevealProvider>
      </body>
    </html>
  );
}
