import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://internationalstyles.com"),
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
    url: "https://internationalstyles.com",
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
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${raleway.variable}`}>
      <body className="font-body antialiased">
        <ScrollRevealProvider>{children}</ScrollRevealProvider>
      </body>
    </html>
  );
}
