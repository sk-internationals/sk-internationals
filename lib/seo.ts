import type { Metadata } from "next";

import type { InternalHref } from "@/components/layout/nav-links";
import { OG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Joins a route onto the production origin. The home route is the origin
 * itself — "https://host/" and "https://host" are the same page to a browser
 * and two URLs to a crawler, so the trailing slash is dropped rather than
 * emitted as a second address for the same content.
 */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

interface PageMetadataInput {
  /** Runs through the root layout's `%s | SK Internationals` title template. */
  title: string;
  /** 150–160 characters. Longer is silently truncated in the result page. */
  description: string;
  path: InternalHref;
  /**
   * Link-preview image. Landscape only: portrait photography is letterboxed or
   * centre-cropped by every major scraper, which is how a hero shot becomes an
   * unreadable strip in a LinkedIn card.
   */
  image: { src: string; alt: string };
  /**
   * Headline for social cards where the tab title is too terse to stand alone
   * — a card has no site chrome around it to supply the context a browser tab
   * gets for free. Defaults to the title with the brand appended.
   */
  socialTitle?: string;
}

/**
 * Every route's metadata, built in one place.
 *
 * Next.js merges metadata field by field, and `openGraph` is one field: a page
 * that declares its own replaces the layout's outright rather than extending
 * it. Six pages each declaring a partial `openGraph` block is therefore six
 * pages silently missing `og:site_name`, `og:type`, and `og:locale` — which is
 * exactly what this site shipped. Composing the whole block here means a route
 * cannot express a partial one.
 *
 * `twitter` is deliberately absent. The root layout declares the card type,
 * which is the only value not derivable, and Next fills the title, description,
 * and image from the Open Graph block above — restating them here would be two
 * sources for one fact.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  socialTitle,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      title: socialTitle ?? `${title} | ${SITE_NAME}`,
      description,
      url: path,
      images: [{ url: image.src, alt: image.alt }],
    },
  };
}
