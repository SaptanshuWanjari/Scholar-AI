import React from "react";
import { cn } from "../../ui/utils";

export interface BreadcrumbItem {
  label: string;
  /** Called when clicked. If absent the item renders as plain text. */
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Hand-lettered breadcrumb trail. The last item is the current page (no
 * interaction); earlier items are clickable with a hover color shift.
 * Separator is a Kalam-weight slash — deliberately not an icon.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center gap-1", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span
                className="select-none font-kalam text-sm text-ink-muted/45"
                aria-hidden
              >
                /
              </span>
            )}
            {isLast ? (
              <span
                className="font-architect text-[13px] font-medium text-ink"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="font-architect text-[13px] text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
