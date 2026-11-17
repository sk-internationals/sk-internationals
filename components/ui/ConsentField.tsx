import type { ComponentPropsWithRef } from "react";

import { ROUTES } from "@/components/layout/nav-links";
import { Link } from "@/components/ui/Link";
import { CONSENT_LINK_LABEL, CONSENT_STATEMENT } from "@/content/privacy";
import { cn } from "@/lib/utils";

interface ConsentFieldProps
  extends Omit<ComponentPropsWithRef<"input">, "type" | "id"> {
  /** Unique per page, so the label and error stay paired to this form's box. */
  id: string;
  error?: string;
}

/**
 * The DPDP consent checkbox, shared by the enquiry and quote forms so the
 * wording a person agrees to can never differ between them.
 *
 * Never pre-ticked — consent under the Act must be a clear affirmative action —
 * and required, because without it there is no lawful basis to process the
 * form at all. The notice opens in a new tab so a visitor who reads it does not
 * lose what they have typed.
 */
export function ConsentField({ id, error, className, ...input }: ConsentFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          required
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-border accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            error && "outline-2 outline-error",
          )}
          {...input}
        />
        <label htmlFor={id} className="cursor-pointer text-caption text-text-secondary">
          {CONSENT_STATEMENT}{" "}
          <Link
            href={ROUTES.privacyNotice}
            target="_blank"
            rel="noopener"
            className="font-medium"
          >
            {CONSENT_LINK_LABEL}
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
          .
          <span aria-hidden="true" className="ml-1 text-error">
            *
          </span>
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}
