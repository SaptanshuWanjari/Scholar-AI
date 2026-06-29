import React from "react";
import { cn } from "../../ui/utils";
import { SectionLabel } from "../foundation/SectionHeader";
import { Breadcrumbs } from "../navigation/Breadcrumbs";
import type { BreadcrumbItem } from "../navigation/Breadcrumbs";
import { MarkerHighlight } from "../decorations/MarkerHighlight";

export interface PageTitleProps {
  title: string;
  /** Small eyebrow above the title. */
  eyebrow?: string;
  /** Secondary line below the title. */
  subtitle?: string;
  /** Renders a breadcrumb trail above everything. */
  breadcrumbs?: BreadcrumbItem[];
  /** Right-aligned slot — place action buttons or a date here. */
  action?: React.ReactNode;
  /** Underline the title with a marker sweep. */
  marker?: boolean;
  markerColor?: string;
  className?: string;
}

/**
 * Standard page heading block.
 *
 * Stack (top → bottom, each optional):
 *   breadcrumbs
 *   eyebrow label
 *   title  ← right: action
 *   subtitle
 */
export function PageTitle({
  title,
  eyebrow,
  subtitle,
  breadcrumbs,
  action,
  marker = false,
  markerColor,
  className,
}: PageTitleProps) {
  const heading = (
    <h1 className="font-caveat text-[38px] font-bold leading-[1.1] tracking-[-0.01em] text-ink">
      {title}
    </h1>
  );

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-1" />
      )}

      {eyebrow && (
        <SectionLabel className="text-ink-muted/70">{eyebrow}</SectionLabel>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {marker ? (
            <MarkerHighlight color={markerColor}>{heading}</MarkerHighlight>
          ) : (
            heading
          )}
        </div>
        {action && (
          <div className="mt-1 shrink-0">{action}</div>
        )}
      </div>

      {subtitle && (
        <p className="font-kalam text-[15px] leading-relaxed text-ink-muted/80 max-w-[72ch]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
