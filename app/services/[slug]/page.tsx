import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { CTABand } from "@/components/sections/CTABand";
import { ROUTES } from "@/components/layout/nav-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { serviceNode } from "@/lib/structured-data";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

// Export consultancy also lives under /services, but its page is written by
// hand — Next resolves that static segment ahead of this one, so it is simply
// absent from SERVICES and never generated here.
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

function findService(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);

  // An unknown slug renders the 404 below. Marking it `noindex` here stops a
  // mistyped or stale inbound link from being indexed as a thin page under a
  // URL that will never hold content.
  if (!service) return { title: "Service Not Found", robots: { index: false } };

  return pageMetadata({
    title: service.title,
    // `summary`, not `body`: the body paragraph runs to three or four times the
    // length a result will show, so it was being cut off mid-sentence.
    description: service.summary,
    path: `${ROUTES.services}/${service.slug}`,
    // The headline the page itself opens on. It says what the service does,
    // which a card stripped of the site's navigation needs and the two-word
    // title cannot supply on its own.
    socialTitle: service.desc,
    image: { src: service.image, alt: service.imageAlt },
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) notFound();

  const url = `${ROUTES.services}/${service.slug}` as const;

  // Filed under what the page sells. The company entity is already declared
  // once in the root layout, so this only references it as the provider.
  const serviceJsonLd = serviceNode({
    name: service.title,
    serviceType: service.tag,
    // The full paragraph here, not the meta summary: a description in
    // structured data is not length-capped, and this one should match what the
    // page actually says.
    description: service.body,
    path: url,
    items: service.items,
  });

  return (
    <>
      <PageHero
        eyebrow={service.tag}
        title={service.desc}
        lead={service.body}
        image={service.image}
        breadcrumb={service.title}
        route={url}
        parent={{ label: "Services", href: ROUTES.services }}
      />
      <ServiceDetail service={service} />
      <CTABand />
      <JsonLd data={serviceJsonLd} />
    </>
  );
}
