import { NextResponse } from "next/server";
import { z } from "zod";

import { consentSection, sendFormNotification } from "@/lib/email";

// Mirrors the client schema in components/sections/Contact.tsx. Duplicated
// deliberately: the browser copy is a convenience, this one is the boundary.
// Structured rate requests post to /api/quote instead — this endpoint only
// carries the short "get in touch" note.
//
// The upper bounds have no counterpart on the client and are not meant to have
// one: they are an abuse ceiling, set far above anything a real enquiry needs,
// not a rule a visitor should ever be able to feel.
const enquirySchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.email().max(320),
  phone: z.string().trim().max(50).optional(),
  company: z.string().trim().max(200).optional(),
  // Free text rather than an enum of service titles: the picker is built from
  // the service pages, and a page renamed between deploys must not start
  // rejecting live enquiries at the boundary.
  service: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  // DPDP consent. Without it there is no basis to process anything above, so
  // a request that skips the form's checkbox is refused here, not delivered.
  consent: z.literal(true),
});

export async function POST(request: Request) {
  let body: unknown;

  // A malformed body is a 400, not the unhandled 500 that `await
  // request.json()` throws on its own.
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { name, email, phone, company, service, message } = parsed.data;

  const result = await sendFormNotification({
    // Company rides in the subject because that is what the desk triages on
    // before opening anything.
    subject: company
      ? `New enquiry from ${name} (${company})`
      : `New enquiry from ${name}`,
    replyTo: email,
    source: "contact form",
    sections: [
      {
        heading: "Enquiry",
        fields: [
          { label: "Name", value: name },
          { label: "Company", value: company },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
          {
            label: "Service required",
            value: service,
            fallback: "Not sure yet, advise me",
          },
        ],
      },
      {
        heading: "Message",
        fields: [{ label: "How can we help?", value: message, block: true }],
      },
      consentSection(),
    ],
  });

  if (!result.ok) {
    // Misconfiguration is ours to fix and Resend failing is upstream. Both
    // read as one generic failure to the visitor; only the log tells them
    // apart, and only the status code tells a monitor.
    return NextResponse.json(
      { error: "Failed to send enquiry" },
      { status: result.reason === "misconfigured" ? 500 : 502 },
    );
  }

  return NextResponse.json({ success: true });
}
