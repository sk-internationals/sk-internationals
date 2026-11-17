import type { InternalHref } from "@/components/layout/nav-links";
import { Link } from "@/components/ui/Link";
import { cn } from "@/lib/utils";

export interface InlineLinkItem {
  label: string;
  href: InternalHref;
}

interface InlineLinksProps {
  links: InlineLinkItem[];
  className?: string;
}

/**
 * A run of related pages set as one caption line, dot-separated, wrapping as a
 * sentence does. For cross-references beneath copy that already names the
 * subject — a row of buttons there would outrank the copy it supports.
 */
export function InlineLinks({ links, className }: InlineLinksProps) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-caption",
        className,
      )}
    >
      {links.map((link, i) => (
        <span key={link.href} className="inline-flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-border">
              ·
            </span>
          )}
          <Link href={link.href} className="text-text-secondary!">
            {link.label}
          </Link>
        </span>
      ))}
    </p>
  );
}
