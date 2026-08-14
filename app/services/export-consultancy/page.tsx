import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { ExportAdvisory } from "@/components/sections/ExportAdvisory";
import { CTABand } from "@/components/sections/CTABand";
import { ROUTES } from "@/components/layout/nav-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { serviceNode } from "@/lib/structured-data";

const description =
  "Export advisory for businesses entering international markets: readiness, documentation, DGFT and customs compliance, Incoterms, incentives, and market entry.";

const HERO_IMAGE = "/images/services/export-consultancy.jpg";

export const metadata: Metadata = pageMetadata({
  title: "Export Consultancy",
  description,
  path: ROUTES.exportConsultancy,
  image: {
    src: HERO_IMAGE,
    alt: "Two people in business suits shaking hands",
  },
});

// Named as a service rather than the organization, so search engines file this
// page under what it sells instead of duplicating the company entity already
// declared in the root layout.
const serviceJsonLd = serviceNode({
  name: "Export Consultancy",
  serviceType: "Export advisory and trade compliance consulting",
  description,
  path: ROUTES.exportConsultancy,
});

export default function ExportConsultancyPage() {
  return (
    <>
      <PageHero
        eyebrow="Export Advisory"
        title="Enter Global Markets Without Guessing"
        lead="Exporting is a sequence of decisions long before it is a shipment. We take you through documentation, compliance, costing, and market entry so the first container leaves on solid ground."
        image={HERO_IMAGE}
        breadcrumb="Export Consultancy"
        route={ROUTES.exportConsultancy}
        parent={{ label: "Services", href: ROUTES.services }}
      />
      <ExportAdvisory />
      {/* The advisory section sits on bg-surface-alt, so the CTA starts a new
          background band here and keeps its top padding. */}
      <CTABand flushWithPrevious={false} />
      <JsonLd data={serviceJsonLd} />
    </>
  );
}
