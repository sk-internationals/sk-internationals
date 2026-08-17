import { Resend } from "resend";

/**
 * Delivery of website form submissions to the desk.
 *
 * Server-only by construction. Nothing here is imported from a Client
 * Component, and none of the variables it reads carry the `NEXT_PUBLIC_`
 * prefix — so Next.js never inlines `RESEND_API_KEY` into the browser bundle
 * and the key cannot reach a visitor.
 *
 * Both form routes (`/api/contact`, `/api/quote`) send through this module, so
 * the recipient list and sender identity are configured once in the
 * environment rather than restated per route. Adding a third form means
 * writing a subject and some sections, not another copy of this plumbing.
 */

/**
 * The domain verified with Resend. Mail sent from anything else is unsigned
 * and lands in spam, so a misconfigured sender is refused here rather than
 * discovered from an inbox that stayed empty.
 */
const SENDER_DOMAIN = "skinternationals.in";

/**
 * Exactly three, by requirement. The names are fixed rather than parsed from a
 * comma-separated list: a typo in one address must name the variable that owns
 * it, and a list that silently arrives with two entries is the failure this
 * whole module exists to prevent.
 */
const RECIPIENT_VARS = [
  "FORM_RECIPIENT_1",
  "FORM_RECIPIENT_2",
  "FORM_RECIPIENT_3",
] as const;

/** One submitted answer, as it should read in the notification. */
export interface EmailField {
  label: string;
  value?: string | null;
  /** Shown when the visitor left the field empty. */
  fallback?: string;
  /**
   * Renders the label on its own line with the value beneath it, for free text
   * that would be unreadable folded onto a `Label: value` line.
   */
  block?: boolean;
}

/** A titled group of fields — "Shipment", "Contact", "Message". */
export interface EmailSection {
  heading: string;
  fields: EmailField[];
}

export interface FormNotification {
  /** What the desk triages on before opening anything. */
  subject: string;
  /** The visitor's address, so a reply reaches them and not us. */
  replyTo: string;
  /** Which form this came from, printed in the footer. */
  source: string;
  sections: EmailSection[];
}

/**
 * `misconfigured` is our fault and `provider` is Resend's. The routes map them
 * to different status codes, and the distinction is the first thing worth
 * knowing when a submission goes missing.
 */
export type SendResult =
  | { ok: true }
  | { ok: false; reason: "misconfigured" | "provider" };

interface MailConfig {
  apiKey: string;
  from: string;
  to: string[];
}

const ADDRESS_PATTERN = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/;

/**
 * Pulls the bare address out of either accepted form — `a@b.com` or
 * `Name <a@b.com>` — and returns null if what is left is not an address.
 * Display names are allowed because `SK Internationals Website <…>` reads far
 * better in an inbox than a bare mailbox does.
 */
function mailboxOf(value: string): string | null {
  const angled = value.match(/<([^>]*)>\s*$/);
  const address = (angled ? angled[1] : value).trim();
  return ADDRESS_PATTERN.test(address) ? address.toLowerCase() : null;
}

function isVerifiedSender(address: string): boolean {
  const domain = address.slice(address.lastIndexOf("@") + 1);
  return domain === SENDER_DOMAIN || domain.endsWith(`.${SENDER_DOMAIN}`);
}

/**
 * Reads the environment once per request. Deliberately not hoisted to module
 * scope: a route handler must not crash the whole server process because a
 * variable is missing, and on Vercel an env change should take effect on the
 * next request rather than the next cold start.
 *
 * Collects every problem instead of throwing on the first, so a fresh
 * deployment gets one log naming everything it still has to set.
 */
function readMailConfig():
  | { config: MailConfig; problems?: undefined }
  | { config?: undefined; problems: string[] } {
  const problems: string[] = [];

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) problems.push("RESEND_API_KEY is not set.");
  const FORM_FROM_EMAIL = "noreply@skinternationals.in";
  const from = FORM_FROM_EMAIL.trim();
  const fromMailbox = from ? mailboxOf(from) : null;

  if (!from) {
    problems.push("FORM_FROM_EMAIL is not set.");
  } else if (!fromMailbox) {
    problems.push(`FORM_FROM_EMAIL is not a valid email address: "${from}".`);
  } else if (!isVerifiedSender(fromMailbox)) {
    problems.push(
      `FORM_FROM_EMAIL must send from the verified @${SENDER_DOMAIN} domain, but is "${fromMailbox}".`,
    );
  }

  const to: string[] = [];
  const seen = new Set<string>();

  for (const variable of RECIPIENT_VARS) {
    const raw = process.env[variable]?.trim();

    if (!raw) {
      problems.push(`${variable} is not set.`);
      continue;
    }

    const address = mailboxOf(raw);

    if (!address) {
      problems.push(`${variable} is not a valid email address: "${raw}".`);
      continue;
    }

    // Two variables holding one address means two people get the submission
    // and the third never learns it exists — the exact silent failure the
    // three-recipient requirement is guarding against.
    if (seen.has(address)) {
      problems.push(
        `${variable} repeats "${address}", which is already configured. All three recipients must be different.`,
      );
      continue;
    }

    seen.add(address);
    to.push(raw);
  }

  if (problems.length > 0) return { problems };

  // Every branch above pushed a problem on failure, so reaching here means all
  // four values parsed.
  return { config: { apiKey: apiKey!, from: from!, to } };
}

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Everything in these emails is visitor-supplied, so nothing goes in raw. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

/** Empty, whitespace-only, and absent all read the same to a human. */
function resolve(field: EmailField): string {
  const value = field.value?.trim();
  return value || field.fallback || "Not provided";
}

/** Coimbatore time, because that is where the desk reading this sits. */
function submittedAt(): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

/**
 * The plain-text part. Not a fallback afterthought — it is what a phone
 * previews, what a spam filter reads, and what most of this desk will actually
 * see first.
 */
function toText(notification: FormNotification, timestamp: string): string {
  const lines: string[] = [];

  for (const section of notification.sections) {
    lines.push(section.heading.toUpperCase());

    for (const field of section.fields) {
      const value = resolve(field);
      if (field.block) {
        lines.push(`${field.label}:`, value);
      } else {
        lines.push(`${field.label}: ${value}`);
      }
    }

    lines.push("");
  }

  lines.push(
    "—",
    `Submitted via the ${notification.source} on ${timestamp} IST.`,
    `Reply to this email to answer ${notification.replyTo} directly.`,
  );

  return lines.join("\n");
}

/**
 * The HTML part. Inline styles and a table layout because email clients strip
 * stylesheets; colours are lifted from DESIGN_SYSTEM tokens by hand for the
 * same reason — a CSS variable does not survive the trip to an inbox.
 */
function toHtml(notification: FormNotification, timestamp: string): string {
  const sections = notification.sections
    .map((section) => {
      const rows = section.fields
        .map((field) => {
          const value = escapeHtml(resolve(field));
          const label = escapeHtml(field.label);

          if (field.block) {
            return `<tr><td colspan="2" style="padding:14px 0 0;border-top:1px solid #dde3ec;">
              <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#3d5878;">${label}</div>
              <div style="margin-top:6px;font-size:15px;line-height:1.6;color:#0b2545;white-space:pre-wrap;">${value}</div>
            </td></tr>`;
          }

          return `<tr>
            <td style="padding:12px 16px 12px 0;border-top:1px solid #dde3ec;font-size:13px;color:#3d5878;white-space:nowrap;vertical-align:top;">${label}</td>
            <td style="padding:12px 0;border-top:1px solid #dde3ec;font-size:15px;color:#0b2545;font-weight:600;vertical-align:top;">${value}</td>
          </tr>`;
        })
        .join("");

      return `<tr><td style="padding:28px 32px 4px;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#ea580c;">${escapeHtml(section.heading)}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;border-collapse:collapse;">${rows}</table>
      </td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px 12px;background:#f5f2ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #dde3ec;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:24px 32px;background:#0b2545;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#ffffff;opacity:0.62;">SK Internationals</div>
      <div style="margin-top:6px;font-size:19px;font-weight:600;line-height:1.35;color:#ffffff;">${escapeHtml(notification.subject)}</div>
    </td></tr>
    ${sections}
    <tr><td style="padding:24px 32px 28px;">
      <div style="padding-top:20px;border-top:1px solid #dde3ec;font-size:12px;line-height:1.7;color:#3d5878;">
        Submitted via the ${escapeHtml(notification.source)} on ${escapeHtml(timestamp)} IST.<br />
        Reply to this email to answer
        <a href="mailto:${encodeURI(notification.replyTo)}" style="color:#ea580c;font-weight:600;text-decoration:none;">${escapeHtml(notification.replyTo)}</a>
        directly.
      </div>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Sends one submission to all three configured recipients.
 *
 * A single Resend call carrying three addresses, not three calls: it is one
 * API request against the rate limit, the three copies are identical by
 * construction rather than by coincidence, and there is no partial state where
 * the second send fails after the first has already gone out. Resend delivers
 * per recipient, so one bad mailbox bounces alone instead of taking the other
 * two with it.
 *
 * Never throws. The caller gets a result and decides what the visitor sees.
 */
export async function sendFormNotification(
  notification: FormNotification,
): Promise<SendResult> {
  const { config, problems } = readMailConfig();

  if (problems) {
    console.error(
      `Form email not sent — the environment is incomplete:\n${problems
        .map((problem) => `  • ${problem}`)
        .join("\n")}`,
    );
    return { ok: false, reason: "misconfigured" };
  }

  const timestamp = submittedAt();

  try {
    const resend = new Resend(config.apiKey);

    const { data, error } = await resend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: notification.replyTo,
      subject: notification.subject,
      text: toText(notification, timestamp),
      html: toHtml(notification, timestamp),
    });

    if (error) {
      console.error("Resend rejected the form email:", error);
      return { ok: false, reason: "provider" };
    }

    // The id is the only handle on a delivery once it leaves us — without it
    // in the log there is no way to look a missing submission up later.
    console.info(
      `Form email ${data?.id ?? "(no id returned)"} sent to ${config.to.length} recipients.`,
    );
    return { ok: true };
  } catch (err) {
    console.error("Failed to reach Resend while sending the form email:", err);
    return { ok: false, reason: "provider" };
  }
}
