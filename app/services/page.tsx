import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { Services } from "@/components/sections/Services";
import { GlobalNetworkProcess } from "@/components/sections/GlobalNetworkProcess";
import { CTABand } from "@/components/sections/CTABand";
import { ROUTES } from "@/components/layout/nav-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { serviceListNode } from "@/lib/structured-data";

const description =
  "Freight forwarding, customs clearance, warehousing, transportation, container handling, and trade compliance, coordinated by one team across global trade lanes.";

const HERO_IMAGE = "/images/heroes/services.jpg";

export const metadata: Metadata = pageMetadata({
  // "Services" alone described the navigation rather than the page: it is the
  // one word in the title that a buyer searching for a forwarder would never
  // type. The category names are what this index actually ranks for.
  title: "Logistics & Trade Services",
  description,
  path: ROUTES.services,
  image: {
    src: HERO_IMAGE,
    alt: "Aerial view of a container terminal, a ship at berth beside stacked containers",
  },
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Integrated Logistics & Trade Solutions"
        lead="Fourteen service lines, one shipment file. Every stage stays with the same team, so nothing is handed off and lost."
        image={HERO_IMAGE}
        breadcrumb="Services"
        route={ROUTES.services}
      />
      <Services />
      <GlobalNetworkProcess />
      <CTABand />
      {/* Every entry resolves to a real page in the sitemap, which is the only
          reason this list is worth declaring. */}
      <JsonLd data={serviceListNode(ROUTES.services)} />
    </>
  );
}
