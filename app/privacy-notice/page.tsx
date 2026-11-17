import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/sections/PageHero";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ROUTES } from "@/components/layout/nav-links";
import {
  NOTICE_EFFECTIVE_DATE,
  NOTICE_INTRO,
  NOTICE_SECTIONS,
  PRIVACY_CONTACT_EMAIL,
} from "@/content/privacy";
import { pageMetadata } from "@/lib/seo";

const description =
  "How SK Internationals collects and uses the personal data you share through our enquiry and quote forms, and your rights under India's DPDP Act, 2023.";

// The About page's pairing, reused rather than a new photograph sourced for a
// page that sells nothing: its portrait hero, and the landscape "Who We Are"
// frame for the share card, since scrapers crop portrait to a thin band.
const HERO_IMAGE = "/images/heroes/about.jpg";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice",
  description,
  path: ROUTES.privacyNotice,
  image: {
    src: "/images/overview/who-we-are.jpg",
    alt: "Container terminal at dusk, gantry cranes alongside a berthed vessel",
  },
});

export default function PrivacyNoticePage() {
  return (
    <>
      <PageHero
        eyebrow="Your Data"
        title="Privacy Notice"
        lead="What we collect through this website, why, and how you stay in control of it."
        image={HERO_IMAGE}
        breadcrumb="Privacy Notice"
        route={ROUTES.privacyNotice}
      />

      <Section>
        <Container>
          {/* One reading column: a notice is read top to bottom, once, and
              anything wider than a comfortable line length works against it. */}
          <div className="max-w-3xl">
            <Text as="p" size="caption" color="secondary">
              Effective {NOTICE_EFFECTIVE_DATE}
            </Text>
            <Text as="p" size="body-lg" className="mt-5 text-text">
              {NOTICE_INTRO}
            </Text>

            {NOTICE_SECTIONS.map((section) => (
              <section
                key={section.heading}
                className="mt-14 border-t border-border pt-8"
              >
                <Heading as="h2" size="h3" className="text-text">
                  {section.heading}
                </Heading>
                {section.paragraphs?.map((paragraph) => (
                  <Text
                    key={paragraph.slice(0, 32)}
                    as="p"
                    color="secondary"
                    className="mt-4"
                  >
                    {paragraph}
                  </Text>
                ))}
                {section.items && (
                  <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-body text-text-secondary marker:text-accent">
                    {section.items.map((item) => (
                      <li key={item.slice(0, 32)}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <Text as="p" color="secondary" className="mt-14 border-t border-border pt-8">
              Questions about this notice:{" "}
              <a
                href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
                className="font-medium text-text underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {PRIVACY_CONTACT_EMAIL}
              </a>
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
