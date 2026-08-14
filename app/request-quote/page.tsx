import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { RequestQuote } from "@/components/sections/RequestQuote";
import { ROUTES } from "@/components/layout/nav-links";
import { pageMetadata } from "@/lib/seo";

const description =
  "Tell us the mode, the lane, and the cargo. SK Internationals comes back with a written rate and transit time, usually within one business day.";

// The port at loading, not the aircraft — /contact holds the air frame, and two
// adjacent conversion pages opening on the same photograph read as one page the
// visitor has already seen.
const HERO_IMAGE = "/images/services/freight-forwarding.jpg";

export const metadata: Metadata = pageMetadata({
  title: "Request a Quote",
  description,
  path: ROUTES.requestQuote,
  socialTitle: "Request a Freight Quote",
  image: {
    src: HERO_IMAGE,
    alt: "Aerial view of a container port, container ships alongside the quay",
  },
});

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Quotes for Air, Ocean, Road & Rail Freight"
        lead="Share a few details about the shipment and we will come back with a rate and a transit time, not a callback to ask the same questions again."
        image={HERO_IMAGE}
        breadcrumb="Request a Quote"
        route={ROUTES.requestQuote}
      />
      <RequestQuote />
    </>
  );
}
