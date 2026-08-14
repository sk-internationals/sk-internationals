import { CONTACT_DESKS, OFFICE_HOURS_SPEC } from "@/content/contacts";
import { NETWORK_REGIONS } from "@/content/network";
import { SERVICE_PAGES } from "@/content/services";
import { absoluteUrl } from "@/lib/seo";
import { ORGANIZATION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Stable identifiers for the two things this site describes: the company, and
 * the site itself.
 *
 * Without them every page declared its own anonymous `Organization` node —
 * one in the layout, another inside the contact page, a third inside each
 * service page as a `provider`. A crawler has no way to tell those apart from
 * three different companies that happen to share a name. Anchored to an `@id`,
 * they collapse into one entity that every other node points at, which is what
 * lets a knowledge panel accumulate rather than fragment.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const HEAD_OFFICE_ID = `${SITE_URL}/contact#head-office`;

/** A reference to an entity declared elsewhere in the page's graph. */
const ref = (id: string) => ({ "@id": id });

/**
 * Where cargo actually goes, from `content/network.ts`. India is named as a
 * country because it is where the company operates from and the market these
 * pages are written for; the rest are the destinations the network map already
 * plots, typed as places because half of them ("Europe", "Middle East") are
 * regions rather than countries.
 */
const AREA_SERVED = [
  { "@type": "Country", name: "India" },
  ...NETWORK_REGIONS.map((region) => ({ "@type": "Place", name: region.name })),
];

/** The registered office, in the shape schema.org expects. */
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: ORGANIZATION.streetAddress,
  addressLocality: ORGANIZATION.addressLocality,
  postalCode: ORGANIZATION.postalCode,
  addressRegion: ORGANIZATION.addressRegion,
  addressCountry: ORGANIZATION.addressCountry,
} as const;

/**
 * The company. Every field restates something the site already publishes:
 * the address and general line come from the contact page, the founding year
 * from the about page, the subject list from the services index. Nothing here
 * is a claim a visitor could not verify by reading the page it came from.
 */
const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: ORGANIZATION.name,
  legalName: ORGANIZATION.legalName,
  description: ORGANIZATION.description,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo.png"),
    width: 1200,
    height: 683,
  },
  image: absoluteUrl("/logo.png"),
  foundingDate: ORGANIZATION.foundingDate,
  email: ORGANIZATION.email,
  telephone: ORGANIZATION.telephone,
  address: POSTAL_ADDRESS,
  areaServed: AREA_SERVED,
  // What the company is an authority on, named as its own service pages name
  // it — the shortest honest description of the entity's subject matter.
  knowsAbout: SERVICE_PAGES.map((service) => service.title),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    areaServed: "Worldwide",
  },
  // Ties the site to the company's verified profile, so search engines resolve
  // both to one entity rather than two.
  sameAs: [ORGANIZATION.linkedin],
};

/**
 * The site as distinct from the company that publishes it. This is what lets a
 * result carry the site's name rather than a bare domain, and it is the node
 * every page's `isPartOf` points back to.
 */
const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: ref(ORGANIZATION_ID),
  inLanguage: "en-IN",
};

/**
 * Rendered once, in the root layout, so both entities are resolvable from
 * every page — which is what makes the bare `@id` references on the contact
 * and service pages point at something.
 */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationNode, websiteNode],
};

/**
 * The Coimbatore head office as a place of business, emitted on the contact
 * page only — the one page that publishes the address, the counter hours, and
 * the desk that answers each number.
 *
 * A `LocalBusiness` rather than a second `Organization`: this is the physical
 * office among the company's six, and `parentOrganization` says so instead of
 * letting it read as a separate firm with the same name.
 */
export const headOfficeNode = {
  "@type": "LocalBusiness",
  "@id": HEAD_OFFICE_ID,
  name: ORGANIZATION.name,
  description: ORGANIZATION.description,
  url: absoluteUrl("/contact"),
  parentOrganization: ref(ORGANIZATION_ID),
  address: POSTAL_ADDRESS,
  telephone: ORGANIZATION.telephone,
  email: ORGANIZATION.email,
  image: absoluteUrl("/logo.png"),
  areaServed: AREA_SERVED,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...OFFICE_HOURS_SPEC.days],
    opens: OFFICE_HOURS_SPEC.opens,
    closes: OFFICE_HOURS_SPEC.closes,
  },
  // Every desk the page prints, so structured data cannot name a channel the
  // visitor cannot see. The general line leads: it is the one a result should
  // surface.
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: ORGANIZATION.telephone,
      email: ORGANIZATION.email,
      areaServed: "Worldwide",
    },
    ...CONTACT_DESKS.flatMap((desk) =>
      desk.contacts.map((contact) => ({
        "@type": "ContactPoint",
        contactType: desk.label,
        email: contact.email,
        ...(contact.phone ? { telephone: contact.phone } : {}),
        areaServed: "Worldwide",
      })),
    ),
  ],
  sameAs: [ORGANIZATION.linkedin],
};

interface ServiceNodeInput {
  name: string;
  serviceType: string;
  description: string;
  path: string;
  /** What the service actually covers, as the page lists it. */
  items?: string[];
}

/**
 * One service, filed under what it sells. The provider is a reference rather
 * than a copy — the company is declared once, in the layout, and repeating it
 * here would be a second entity claiming the same name.
 */
export function serviceNode({
  name,
  serviceType,
  description,
  path,
  items,
}: ServiceNodeInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: ref(ORGANIZATION_ID),
    areaServed: AREA_SERVED,
    isPartOf: ref(WEBSITE_ID),
    ...(items && items.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${name} capabilities`,
            itemListElement: items.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item },
            })),
          },
        }
      : {}),
  };
}

/**
 * The services index as a list of real, reachable pages. Every entry resolves
 * to a URL in the sitemap, which is the only reason this is worth emitting —
 * an `ItemList` of things that are not pages tells a crawler nothing.
 */
export function serviceListNode(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#collection`,
    url: absoluteUrl(path),
    name: "Logistics & Trade Services",
    isPartOf: ref(WEBSITE_ID),
    about: ref(ORGANIZATION_ID),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: SERVICE_PAGES.length,
      itemListElement: SERVICE_PAGES.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: absoluteUrl(service.href),
      })),
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** The trail a page sits at the end of, as rendered above its heading. */
export function breadcrumbNode(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * The home page's FAQ, restated. Emitted only because the questions and
 * answers are rendered on the page verbatim — an FAQ that exists solely in
 * structured data is the spam pattern this schema is policed for.
 */
export function faqNode(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
