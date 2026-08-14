/**
 * Who answers, and for what. Supplied by the client for publication,
 * superseding the single general channel recorded in BUSINESS_CONTEXT.md.
 *
 * One list, three surfaces — the contact page, the footer, and the
 * organisation's structured data — so a number can never be corrected in one
 * place and left stale in the others. Everything else about the company
 * (registered address, the general line) stays in `lib/site.ts`; this file is
 * only the human routing table.
 */

export interface DeskContact {
  /**
   * As the person is addressed, taken from their own published address. Absent
   * where the mailbox belongs to the desk rather than to a person — a shared
   * inbox given a name would be a person who doesn't exist.
   */
  name?: string;
  /** Job title, published only where the client has confirmed one. */
  role?: string;
  email: string;
  /**
   * Display form, spaced as an Indian mobile is read aloud. Absent where the
   * client gave no number — an operations file is opened by email there, and
   * inventing a line to fill the column would be a promise we can't keep.
   */
  phone?: string;
}

export interface DeskTopic {
  label: string;
  href: `/services/${string}`;
}

export interface ContactDesk {
  /** Stable key the page maps to an icon, so this file stays plain data. */
  id: "customer-service" | "operations" | "compliance";
  label: string;
  /** What this desk handles, so the choice is obvious before dialling. */
  purpose: string;
  contacts: DeskContact[];
  /**
   * Named service pages the desk answers for. Only the compliance desk carries
   * these: BIS, EPR, and DGFT arrive as a licence name rather than as a
   * shipment, and the enquirer needs to see the name they came looking for.
   */
  topics?: DeskTopic[];
}

export const CONTACT_DESKS: ContactDesk[] = [
  {
    id: "customer-service",
    // The client calls this "CS & Coordinating" internally. Written out here:
    // an exporter scanning for who to call should not have to decode an
    // abbreviation to find the desk that answers day to day.
    label: "Customer Service & Coordination",
    purpose: "Bookings, rates, documents, and updates while cargo is moving.",
    contacts: [
      { email: "sk@skinternationals.in", phone: "+91 84898 56666" },
      { name: "Ramki", email: "ramki@skinternationals.in", phone: "+91 85240 80495" },
      {
        name: "Senthilkumar",
        email: "senthilkumar@skinternationals.in",
        phone: "+91 84898 89974",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    purpose:
      "Carriers, customs, and container handling at the port and on the road.",
    contacts: [
      // Ramki sits on both desks in the client's own list; carried through
      // rather than deduplicated, because who you reach is the point of this
      // table — and an exporter mid-shipment reaches him here, not there.
      { name: "Saravanakumaar", email: "saravanakumaar@skinternationals.in" },
      { name: "Ramki", email: "ramki@skinternationals.in" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance & Licensing",
    // No dedicated mailbox exists for this work yet, so the desk is described
    // by what it routes to rather than given an address that would bounce.
    // Certification enquiries open on the customer service desk and are worked
    // by the export advisory team.
    purpose:
      "Certification and licensing, opened on the customer service desk and worked by our advisory team.",
    contacts: [
      { email: "sk@skinternationals.in", phone: "+91 84898 56666" },
    ],
    topics: [
      { label: "BIS Certification", href: "/services/bis-certification" },
      { label: "EPR Compliance", href: "/services/epr-compliance" },
      { label: "DGFT and Licensing", href: "/services/dgft-and-licensing" },
      { label: "Export Legalization", href: "/services/export-legalization" },
    ],
  },
];

/**
 * Counter hours, held as data rather than as a sentence.
 *
 * The contact page prints these and the page's structured data declares them
 * as an `openingHoursSpecification`, which wants 24-hour times and named days.
 * Written twice, the two drift the first time the counter opens an hour
 * earlier — and structured data that contradicts the visible page is a
 * violation rather than a typo. So this is the source and the sentence below
 * is derived from it.
 *
 * The operations cover runs past these hours; AFTER_HOURS_NOTE says so.
 */
export const OFFICE_HOURS_SPEC = {
  days: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  /** 24-hour, as schema.org requires. */
  opens: "09:30",
  closes: "18:30",
  timeZone: "IST",
} as const;

/** "09:30" → "9:30am". The form the counter hours are read aloud in. */
function to12Hour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")}${hours < 12 ? "am" : "pm"}`;
}

const { days, opens, closes, timeZone } = OFFICE_HOURS_SPEC;

export const OFFICE_HOURS = `${days[0]} to ${days[days.length - 1]}, ${to12Hour(opens)} to ${to12Hour(closes)} ${timeZone}`;

export const AFTER_HOURS_NOTE =
  "24x7 customer service, with updates through your shipment's transit.";

/** How fast a written enquiry is answered — stated once, quoted everywhere. */
export const RESPONSE_TIME = "Replies within one business day";
