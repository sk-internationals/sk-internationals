import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { StatCard } from "@/components/ui/StatCard";
import { InlineLinks } from "@/components/ui/InlineLinks";
import { ROUTES } from "@/components/layout/nav-links";
import {
  ABOUT_HIGHLIGHTS,
  ABOUT_PARAGRAPHS,
  ABOUT_SERVICE_HREFS,
  ABOUT_STATS,
} from "@/content/about";
import { servicePageByHref } from "@/content/services";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <Section id="about">
      <Container>
        {/* The page hero carries the section's headline, so this reads as one
            continuous column of substance rather than repeating a title. */}
        {ABOUT_PARAGRAPHS.map((paragraph, i) => (
          <Text
            key={paragraph.slice(0, 24)}
            as="p"
            size={i === 0 ? "body-lg" : "body"}
            color={i === 0 ? "primary" : "secondary"}
            className={cn("max-w-3xl", i > 0 && "mt-5")}
          >
            {paragraph}
          </Text>
        ))}

        {/* The closing paragraph names the work; this is where each piece of
            it, and the sectors it is done for, can be opened. */}
        <InlineLinks
          className="mt-6 max-w-3xl"
          links={[
            ...ABOUT_SERVICE_HREFS.map((href) => ({
              label: servicePageByHref(href).title,
              href,
            })),
            { label: "Industries We Serve", href: ROUTES.industries },
          ]}
        />

        <div className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-3">
          <StatCard
            value={ABOUT_STATS.years.target}
            unit={ABOUT_STATS.years.unit}
            label={ABOUT_STATS.years.label}
          />
          <StatCard
            value={ABOUT_STATS.experience.target}
            label={ABOUT_STATS.experience.label}
          />
          <StatCard
            value={ABOUT_STATS.businesses.target}
            label={ABOUT_STATS.businesses.label}
          />
        </div>

        <div className="mt-20 grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title} className="border-t border-border pt-5">
              <Heading as="h2" size="h3" className="text-text">
                {highlight.title}
              </Heading>
              <Text as="p" color="secondary" className="mt-2.5">
                {highlight.desc}
              </Text>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
