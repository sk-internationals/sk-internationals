import { NextResponse } from "next/server";
import { z } from "zod";

import { COUNTRY_LABELS } from "@/content/countries";
import { QUOTE_LABELS } from "@/content/quote";
import { consentSection, sendFormNotification } from "@/lib/email";

// Mirrors the client schema in components/sections/RequestQuote.tsx. Duplicated
// deliberately: the browser copy is a convenience, this one is the boundary,
// and a request that skips the form must still be rejected here.
//
// As on the enquiry route, the upper bounds are an abuse ceiling rather than a
// rule a real request can run into.
const quoteSchema = z.object({
  mode: z.string().trim().min(1).max(100),
  movement: z.string().trim().min(1).max(100),
  // ISO 3166-1 alpha-2. Kept as a loose string, like `service` on the enquiry
  // route: the label lookup falls back to the raw code, so a country the
  // dataset renames is still delivered rather than rejected at the boundary.
  origin_country: z.string().trim().min(1).max(100),
  destination_country: z.string().trim().min(1).max(100),
  cargo: z.string().trim().min(1).max(100),
  quantity: z.string().trim().min(1).max(500),
  purpose: z.string().trim().min(1).max(100),
  name: z.string().trim().min(2).max(200),
  email: z.email().max(320),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().max(5000).optional(),
  // DPDP consent — refused at the boundary when absent, as on /api/contact.
  consent: z.literal(true),
});

/** Falls back to the raw value so an unknown option still reaches a human. */
const label = (map: Record<string, string>, value: string) =>
  map[value] ?? value;

export async function POST(request: Request) {
  let body: unknown;

  // A malformed body is a 400, not the unhandled 500 that `await
  // request.json()` throws on its own.
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const {
    mode,
    movement,
    origin_country,
    destination_country,
    cargo,
    quantity,
    purpose,
    name,
    email,
    phone,
    message,
  } = parsed.data;

  const lane = `${label(COUNTRY_LABELS, origin_country)} → ${label(COUNTRY_LABELS, destination_country)}`;

  const result = await sendFormNotification({
    // The lane is in the subject so a rate request is triageable from the
    // inbox list without opening it.
    subject: `Quote request: ${lane} (${label(QUOTE_LABELS, mode)})`,
    replyTo: email,
    source: "quote request form",
    sections: [
      {
        heading: "Shipment",
        fields: [
          { label: "Mode", value: label(QUOTE_LABELS, mode) },
          { label: "Movement type", value: label(QUOTE_LABELS, movement) },
          { label: "Lane", value: lane },
          { label: "Origin", value: label(COUNTRY_LABELS, origin_country) },
          {
            label: "Destination",
            value: label(COUNTRY_LABELS, destination_country),
          },
          { label: "Cargo", value: label(QUOTE_LABELS, cargo) },
          { label: "Approximate quantity", value: quantity },
          {
            label: "Commercial or personal",
            value: label(QUOTE_LABELS, purpose),
          },
        ],
      },
      {
        heading: "Contact",
        fields: [
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
        ],
      },
      {
        heading: "Notes",
        fields: [
          {
            label: "Anything else",
            value: message,
            fallback: "None",
            block: true,
          },
        ],
      },
      consentSection(),
    ],
  });

  if (!result.ok) {
    // Misconfiguration is ours to fix and Resend failing is upstream. Both
    // read as one generic failure to the visitor; only the log tells them
    // apart, and only the status code tells a monitor.
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: result.reason === "misconfigured" ? 500 : 502 },
    );
  }

  return NextResponse.json({ success: true });
}
