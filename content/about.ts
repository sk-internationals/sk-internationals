import type { ServicePage } from "@/content/services";

export const ABOUT_PARAGRAPHS: string[] = [
  "At SK Internationals, we partner with businesses to simplify logistics, streamline operations, and support sustainable growth. Every shipment we manage reflects our commitment to reliability, transparency, and relationships built to last.",
  "Established in 2011, we have spent over a decade building trusted relationships by delivering dependable logistics solutions backed by a team with 20+ years of industry experience.",
  "We are a full service EXIM and logistics support company, operating as a 3PL and 4PL provider for importers and exporters. Freight, customs clearance, DGFT and licensing work, compliance, and warehousing all sit on one shipment file, held by one team from the first instruction to the final delivery.",
];

/**
 * The work the closing paragraph names, in the order it names it, linked
 * beneath it. Hrefs only: titles are read from the service pages, so a renamed
 * service cannot leave a stale label here.
 */
export const ABOUT_SERVICE_HREFS: ServicePage["href"][] = [
  "/services/freight-forwarding",
  "/services/customs-clearance",
  "/services/dgft-and-licensing",
  "/services/warehousing",
];

export interface AboutHighlight {
  title: string;
  desc: string;
}

export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    title: "Putting Customers First",
    desc: "Every client is unique, and every solution is tailored to their business needs.",
  },
  {
    title: "Operational Excellence",
    desc: "Efficient planning and execution ensure reliable logistics operations.",
  },
  {
    title: "Partnerships That Last",
    desc: "We focus on building lasting relationships based on trust, transparency, and consistency.",
  },
  {
    title: "Vision for the Future",
    desc: "Expanding beyond logistics to support businesses with global trade and export solutions.",
  },
];

export const ABOUT_STATS = {
  years: {
    target: 14,
    unit: "years",
    label: "Delivering trusted logistics solutions since 2011",
  },
  experience: { target: 20, label: "Combined industry expertise within our team" },
  businesses: { target: 50, label: "Businesses trusted across diverse industries" },
};
