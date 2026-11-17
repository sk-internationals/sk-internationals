/**
 * The privacy notice the two website forms rely on for consent under India's
 * Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025.
 *
 * DRAFT for the client's confirmation. Every statement here describes what the
 * site actually does today — the fields both forms collect, where submissions
 * go, which services process them — so nothing promises a practice that does
 * not exist. The retention period and the grievance contact are business
 * commitments the client must confirm before this is treated as final.
 *
 * One source for three surfaces: the notice page renders it, both forms quote
 * CONSENT_STATEMENT beside the checkbox, and every submission email records
 * NOTICE_VERSION — so the desk can always tell which wording a person agreed to.
 */

/**
 * Bump on any change to what the notice says. A consent given to an earlier
 * version stays recorded against that version in the email that carried it.
 */
export const NOTICE_VERSION = "2026-11-17";

/** As printed at the top of the notice. */
export const NOTICE_EFFECTIVE_DATE = "17 November 2026";

/**
 * Where a person withdraws consent, asks for their data, or raises a
 * grievance. Confirmed by the client as the main desk inbox.
 */
export const PRIVACY_CONTACT_EMAIL = "sk@skinternationals.in";

/**
 * The words beside the checkbox. Names the purpose and nothing beyond it:
 * consent under the Act must be specific, so it covers answering this enquiry
 * and no marketing.
 */
export const CONSENT_STATEMENT =
  "I agree to SK Internationals using the details in this form to respond to my enquiry, as described in the";

export const CONSENT_LINK_LABEL = "Privacy Notice";

export const CONSENT_REQUIRED_MESSAGE =
  "Please confirm your consent so we can respond to your enquiry";

export interface NoticeSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export const NOTICE_INTRO =
  "This notice explains what personal data SK Internationals collects through the enquiry and quote forms on this website, why we collect it, and the rights you have over it under India's Digital Personal Data Protection Act, 2023. We ask for your consent before you submit either form, and we use your data only for the purpose described here.";

export const NOTICE_SECTIONS: NoticeSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "SK Internationals, of SMS Complex, No. 10, 1st Floor, Rani Garden, Singanallur, Coimbatore 641033, Tamil Nadu, India, decides how and why the personal data you give us is processed. Under the Act this makes us the Data Fiduciary for that data.",
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "Only what you type into a form. We do not use analytics, advertising trackers, or tracking cookies on this website.",
    ],
    items: [
      "Enquiry form: your name and email address; optionally your company, phone number, and the service you are interested in; and your message.",
      "Quote form: your name and email address; optionally your phone number and notes; and the shipment details you give us, such as mode, movement type, origin and destination countries, cargo type, quantity, and whether the shipment is commercial or personal.",
      "A record that you gave consent, with the date and the version of this notice you agreed to.",
    ],
  },
  {
    heading: "Why we collect it",
    paragraphs: [
      "To read and respond to your enquiry or quote request: to prepare a rate, ask follow-up questions about your shipment, and reply to you by email, phone, or WhatsApp using the details you provided. We do not use your data for marketing, sell it, or share it with anyone for their own purposes.",
    ],
  },
  {
    heading: "Who processes it on our behalf",
    paragraphs: [
      "Your submission is delivered as an email to our customer service and operations team. To do this we rely on service providers who process the data only on our instructions:",
    ],
    items: [
      "Vercel, which hosts this website and receives the form submission.",
      "Resend, which delivers the submission to our inboxes.",
      "Microsoft, which hosts our business email.",
    ],
  },
  {
    heading: "Transfers outside India",
    paragraphs: [
      "These providers may process data on servers outside India. We do not transfer personal data to any country the Government of India has restricted under the Act.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep your enquiry for as long as we need it to respond and to follow up on that conversation, and delete it within three years of our last contact with you. If your enquiry becomes a shipment we handle, the records of that shipment are kept for as long as tax, customs, and other Indian laws require.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      `You can exercise any of these rights by emailing ${PRIVACY_CONTACT_EMAIL}:`,
    ],
    items: [
      "Withdraw your consent at any time. Withdrawing is as easy as giving it: send us an email. It does not affect anything we did before you withdrew, but we will stop using your data and delete it unless the law requires us to keep it.",
      "Ask for a summary of the personal data we hold about you and how we have used it.",
      "Ask us to correct, complete, update, or erase your personal data.",
      "Nominate another person to exercise these rights for you in the event of your death or incapacity.",
    ],
  },
  {
    heading: "Grievances and complaints",
    paragraphs: [
      `If you have a concern about how we handle your personal data, write to ${PRIVACY_CONTACT_EMAIL}. We will respond within the time the DPDP Rules allow, and in any case within 90 days.`,
      "If you are not satisfied with our response, you may complain to the Data Protection Board of India.",
    ],
  },
  {
    heading: "Changes to this notice",
    paragraphs: [
      "If we change how we use personal data, we will update this notice and its effective date. A change that needs new consent will be asked for again before it applies to you.",
    ],
  },
];
