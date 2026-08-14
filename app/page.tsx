import { Hero } from "@/components/sections/Hero";
import { ServiceTicker } from "@/components/sections/ServiceTicker";
import { SiteOverview } from "@/components/sections/SiteOverview";
import { ExportEnablement } from "@/components/sections/ExportEnablement";
import { FAQ } from "@/components/sections/FAQ";
import { CTABand } from "@/components/sections/CTABand";
import { FAQS } from "@/content/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqNode } from "@/lib/structured-data";

// The home page's title, description, and canonical are the site-wide defaults
// in app/layout.tsx — this is the one route where the fallback is the intended
// value, so re-declaring them here would be two sources for one string.

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceTicker />
      <SiteOverview />
      <ExportEnablement />
      <FAQ />
      <CTABand />
      <JsonLd data={faqNode(FAQS)} />
    </>
  );
}
