import React from "react";
import { cn } from "@/paper-ui/utils";
import { MarkerHighlight } from "@/paper-ui/core";

interface HeadingBaseProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Underline with a hand-drawn marker sweep. */
  marker?: boolean;
  markerColor?: string;
}

function withMarker(
  node: React.ReactElement,
  marker: boolean | undefined,
  markerColor: string | undefined,
) {
  if (!marker) return node;
  return <MarkerHighlight color={markerColor}>{node}</MarkerHighlight>;
}

/** Largest page-level title. Caveat 38 px bold. */
export function PaperH1({ children, marker, markerColor, className, ...props }: HeadingBaseProps) {
  return withMarker(
    <h1
      className={cn("font-caveat text-[38px] font-bold leading-[1.1] tracking-[-0.01em] text-ink", className)}
      {...props}
    >
      {children}
    </h1>,
    marker,
    markerColor,
  );
}

/** Chapter / top-section heading. Caveat 28 px semibold. */
export function PaperH2({ children, marker, markerColor, className, ...props }: HeadingBaseProps) {
  return withMarker(
    <h2
      className={cn("font-caveat text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink", className)}
      {...props}
    >
      {children}
    </h2>,
    marker,
    markerColor,
  );
}

/** Sub-section heading. Kalam 20 px bold. */
export function PaperH3({ children, marker, markerColor, className, ...props }: HeadingBaseProps) {
  return withMarker(
    <h3
      className={cn("font-kalam text-[20px] font-bold leading-snug text-ink", className)}
      {...props}
    >
      {children}
    </h3>,
    marker,
    markerColor,
  );
}

/** Minor section heading. Kalam 15 px bold. */
export function PaperH4({ children, marker, markerColor, className, ...props }: HeadingBaseProps) {
  return withMarker(
    <h4
      className={cn("font-kalam text-[15px] font-bold leading-snug text-ink", className)}
      {...props}
    >
      {children}
    </h4>,
    marker,
    markerColor,
  );
}

/** Compact label heading. Architects Daughter uppercase. */
export function PaperH5({ children, className, ...props }: HeadingBaseProps) {
  return (
    <h5
      className={cn(
        "font-architect text-[13px] font-medium uppercase tracking-[0.1em] text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </h5>
  );
}

/** Smallest label heading. Architects Daughter uppercase muted. */
export function PaperH6({ children, className, ...props }: HeadingBaseProps) {
  return (
    <h6
      className={cn(
        "font-architect text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted",
        className,
      )}
      {...props}
    >
      {children}
    </h6>
  );
}
