import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { Contact } from "@/components/sections/Contact";
import { ContactOffices } from "@/components/sections/ContactOffices";
import { ROUTES } from "@/components/layout/nav-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import {
  headOfficeNode,
  HEAD_OFFICE_ID,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "@/lib/structured-data";

const description =
  "Reach the SK Internationals desk that owns your file: customer service, operations, or compliance. Email or WhatsApp and we reply within one business day.";

const HERO_IMAGE = "/images/heroes/contact2.png";

// The hero cropped to 1200×630 and saved as JPEG for link previews only. The
// hero itself is a 2.5 MB PNG, past the size WhatsApp and LinkedIn will fetch
// for a card, so a shared contact link was arriving with no picture.
const SOCIAL_IMAGE = "/images/og/contact.jpg";

export const metadata: Metadata = pageMetadata({
  // "Contact Us" rather than "Contact": it is how the search is actually
  // typed, and it costs nothing in the tab.
  title: "Contact Us",
  description,
  path: ROUTES.contact,
  socialTitle: "Contact SK Internationals",
  image: {
    src: SOCIAL_IMAGE,
    alt: "A cargo aircraft in SK Internationals livery taking off",
  },
});

/**
 * The page, and the office it publishes.
 *
 * `ContactPage` points at the company by `@id` rather than restating it — the
 * organization is declared once in the root layout, and a second copy here
 * would read as a second company with the same name. `LocalBusiness` is the
 * physical head office among the company's Indian branches, which is the node
 * that carries the address, the counter hours, and every desk the page prints.
 */
const contactGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${absoluteUrl(ROUTES.contact)}#contactpage`,
      url: absoluteUrl(ROUTES.contact),
      name: "Contact SK Internationals",
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      mainEntity: { "@id": HEAD_OFFICE_ID },
    },
    headOfficeNode,
  ],
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        // The promise the rest of the page then has to keep: named desks, named
        // people, and a number beside each one. A headline about "our team" or
        // "getting in touch" could sit on any forwarder's site — this one only
        // works if the register below it is real.
        title="Your Shipment Gets a Name, Not a Ticket Number"
        lead="Customer service, operations, compliance. The desk that owns your file is the one that replies."
        image={HERO_IMAGE}
        breadcrumb="Contact"
        route={ROUTES.contact}
        assurances={[
          "Replies within one business day",
          "24×7 while your cargo is in transit",
          "Moving cargo since 2011",
        ]}
      />
      <Contact />
      <ContactOffices />

      <JsonLd data={contactGraph} />
    </>
  );
}
