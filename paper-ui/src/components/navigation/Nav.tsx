import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperCard, PaperPanel } from "@paper-ui/core";
import { Tape, PaperClip } from "@paper-ui/components/decorations";
import { NavGroup } from "./NavGroup";
import { NavCollapse } from "./NavCollapse";
import { NavFooter } from "./NavFooter";

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Nav({ children, className, style, ...props }: NavProps) {
  return (
    <nav
      className={cn("relative flex flex-col p-0", className)}
      style={style}
      {...props}
    >
      <PaperCard surface="#fffdf9" shadow="md" texture className="flex h-full w-full flex-col">
        <Tape corner="top-left" width={52} rotate={-8} />
        <Tape corner="top-right" width={48} rotate={7} />
        {children}
      </PaperCard>
    </nav>
  );
}

Nav.displayName = "Nav";

interface NavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hasBorder?: boolean;
}

export function NavSection({ children, className, hasBorder, ...props }: NavSectionProps) {
  return (
    <div
      className={cn(
        "pb-2",
        hasBorder !== false && "border-b border-dashed border-ink/8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

NavSection.displayName = "NavSection";

interface NavLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NavLabel({ children, className, ...props }: NavLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between font-architect text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted px-4 pt-4 pb-1",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
    </div>
  );
}

NavLabel.displayName = "NavLabel";

interface NavItemBaseProps {
  active?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
}

type NavItemProps = NavItemBaseProps & ({ href: string } | { href?: undefined });

export function NavItem({
  active = false,
  icon,
  href,
  disabled,
  children,
  className,
  onClick,
  ...rest
}: NavItemProps) {
  const content = (
    <span className="relative flex flex-1 items-center gap-3">
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-full pointer-events-none">
          <svg
            className="absolute bottom-[2px] left-0 w-full overflow-visible"
            style={{ height: 8 }}
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M1,7 Q26,3 52,6 T99,6"
              fill="none"
              stroke="#f6e27a"
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.7}
            />
          </svg>
        </span>
      )}
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-sm bg-ochre/60" aria-hidden />
      )}
      {icon && <span className="relative z-[1] shrink-0">{icon}</span>}
      <span className="relative z-[1]">{children}</span>
    </span>
  );

  const sharedClasses = cn(
    "relative flex w-full items-center gap-3 px-4 py-2.5 font-kalam text-[14px] transition-colors",
    active && "bg-ink/[0.04] text-ink",
    !active && !disabled && "text-ink-muted hover:text-ink hover:bg-ink/[0.02]",
    disabled && "text-ink-muted/40 cursor-not-allowed",
    className,
  );

  if (href && !disabled) {
    return (
      <a href={href} className={sharedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={sharedClasses}
    >
      {content}
    </button>
  );
}

NavItem.displayName = "NavItem";

type BadgeTone = "ink" | "sage" | "ochre" | "sky" | "lavender" | "brick";

const BADGE_SURFACES: Record<BadgeTone, string> = {
  ink: "#2c2822",
  sage: "#7a8b6e",
  ochre: "#b88a4a",
  sky: "#6b8aad",
  lavender: "#8b7da8",
  brick: "#b0655a",
};

interface NavBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number | string;
  tone?: BadgeTone;
}

export function NavBadge({ count, tone = "ink", className, ...props }: NavBadgeProps) {
  if (count === undefined) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-architect text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] min-w-[20px] text-center text-white/90",
        className,
      )}
      style={{ backgroundColor: BADGE_SURFACES[tone] }}
      {...props}
    >
      {count}
    </span>
  );
}

NavBadge.displayName = "NavBadge";

Nav.Section = NavSection;
Nav.Label = NavLabel;
Nav.Item = NavItem;
Nav.Badge = NavBadge;
Nav.Group = NavGroup;
Nav.Collapse = NavCollapse;
Nav.Footer = NavFooter;
