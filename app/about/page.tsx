import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { About } from "@/components/sections/About";
import { Presence } from "@/components/sections/Presence";
import { WhyChooseSK } from "@/components/sections/WhyChooseSK";
import { CTABand } from "@/components/sections/CTABand";
import { ROUTES } from "@/components/layout/nav-links";
import { OFFICE_CITY_COUNT } from "@/content/network";
import { pageMetadata } from "@/lib/seo";

// The city count is interpolated rather than spelled out: this line claimed
// six while the home page hero rendered the count from content/network.ts, and
// a visitor who reads both is told two different things about the same company.
const description = `Established in 2011, SK Internationals is an EXIM and logistics partner with offices in ${OFFICE_CITY_COUNT} Indian cities, built on transparency and lasting relationships.`;

const HERO_IMAGE = "/images/heroes/about.jpg";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description,
  path: ROUTES.about,
  socialTitle: "About SK Internationals",
  // Not the hero photograph: that frame is portrait (1125×1500), and every
  // link scraper crops a share card to landscape, which reduces a portrait
  // image to an unreadable middle band. This is the "Who We Are" frame the
  // home page already uses for the same route, at 3:2.
  image: {
    src: "/images/overview/who-we-are.jpg",
    alt: "Container terminal at dusk, gantry cranes alongside a berthed vessel",
  },
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="More Than Logistics. Your Partner in Growth."
        lead="A decade of moving cargo for businesses that needed a partner who answers the phone and answers it straight."
        image={HERO_IMAGE}
        breadcrumb="About"
        route={ROUTES.about}
      />
      <About />
      <Presence />
      <WhyChooseSK />
      <CTABand />
    </>
  );
}
