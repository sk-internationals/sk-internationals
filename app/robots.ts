import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The two form endpoints. They accept POST and answer nothing useful to
      // a crawler, so excluding them spends the crawl budget on the pages that
      // are meant to rank. Nothing else is disallowed — every route on this
      // site is intended for indexing.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Names the canonical origin outright, so a crawler that reached the site
    // by another hostname knows which one owns the content.
    host: SITE_URL,
  };
}
