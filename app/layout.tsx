import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/components/layout/Providers";
import { Preloader } from "@/components/layout/Preloader";
import { SkipLink } from "@/components/layout/SkipLink";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ROUTES } from "@/components/layout/nav-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { OFFICE_CITY_COUNT } from "@/content/network";
import { siteGraph } from "@/lib/structured-data";
import { ogImage } from "@/lib/seo";
import { OG_LOCALE, SITE_LANG, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Content of Search Console's HTML-tag verification method, without the tag. */
const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Brand first on the home page, per claude/SEO.md — it is the one page
    // that has to win the branded search as well as the category one. The
    // geography is not decoration: "logistics" alone competes globally, and
    // every buyer this site is written for is shipping out of India.
    default: "SK Internationals | Freight Forwarding & Logistics in India",
    template: "%s | SK Internationals",
  },
  // Replaces a line that promised the Gulf, the Red Sea, and the Indian
  // Subcontinent — three lanes named nowhere else on the site, while the
  // network this company actually publishes (content/network.ts) reaches the
  // Middle East, Europe, the UK, the USA, and beyond. The office count is
  // interpolated from the same constant the hero renders, so the two can never
  // disagree about how many cities there are.
  description: `Freight forwarding, customs clearance, warehousing, and export compliance for importers and exporters. Head office in Coimbatore, offices in ${OFFICE_CITY_COUNT} Indian cities.`,
  alternates: { canonical: ROUTES.home },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    url: ROUTES.home,
    images: [
      ogImage(
        "/hero-port.jpg",
        "Container cranes working a berth at a commercial port",
      ),
    ],
  },
  twitter: { card: "summary_large_image" },
  // Search Console ownership proof, emitted only when the token is configured
  // so preview deploys and local builds never claim the property. Unneeded if
  // the property is verified by DNS instead.
  ...(GOOGLE_SITE_VERIFICATION && {
    verification: { google: GOOGLE_SITE_VERIFICATION },
  }),
  // The card type is the only Twitter value that cannot be inferred; Next
  // fills the title, description, and image from the Open Graph block on each
  // page. `max-image-preview:large` is what earns a thumbnail beside the
  // result on mobile, where most of this traffic lands.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // No fixed height on the root element. Lenis watches the document element
    // with a ResizeObserver to recompute how far the page can scroll, and
    // `h-full` pinned that box to the viewport — so the observer never fired as
    // content grew and Lenis kept serving a stale scroll limit, which reads as
    // the page jamming partway down. `min-h-dvh` on the body preserves the
    // sticky-footer layout this was doing without freezing the measurement.
    <html
      lang={SITE_LANG}
      className={`${inter.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <Preloader />
          <ScrollProgressBar />
          <SkipLink />
          <Header />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
        {/* The company and the site, declared once for the whole app. Every
            other page's structured data references these two by `@id` rather
            than restating them. */}
        <JsonLd data={siteGraph} />
      </body>
    </html>
  );
}
