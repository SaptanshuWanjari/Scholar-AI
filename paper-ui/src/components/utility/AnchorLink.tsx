import React, { useState, useCallback } from "react";
import { Link2 } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

type HeadingAs = "h1" | "h2" | "h3" | "h4";

const HEADING_STYLES: Record<HeadingAs, string> = {
  h1: "font-caveat text-[32px] font-bold leading-tight",
  h2: "font-caveat text-[26px] font-bold leading-tight",
  h3: "font-caveat text-[22px] font-semibold leading-relaxed",
  h4: "font-caveat text-[18px] font-semibold leading-relaxed",
};

export interface AnchorLinkRootProps {
  id: string;
  children?: React.ReactNode;
  as?: HeadingAs;
  className?: string;
}

function AnchorLinkRoot({ id, children, as: Tag = "h2", className }: AnchorLinkRootProps) {
  const [showAnchor, setShowAnchor] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [id]);

  const headingStyle = HEADING_STYLES[Tag];

  return (
    <div
      className={cn("group relative", className)}
      onMouseEnter={() => setShowAnchor(true)}
      onMouseLeave={() => setShowAnchor(false)}
    >
      <Tag id={id} className={cn(headingStyle, "text-ink")}>
        {children}
      </Tag>

      <AnchorLinkLink
        visible={showAnchor}
        copied={copied}
        onClick={handleCopy}
        className="absolute left-[-1.75rem] top-1/2 -translate-y-1/2"
      />
    </div>
  );
}
AnchorLinkRoot.displayName = "AnchorLink.Root";

interface AnchorLinkHeadingProps {
  as?: HeadingAs;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

function AnchorLinkHeading({ as: Tag = "h2", children, className }: AnchorLinkHeadingProps) {
  const style = HEADING_STYLES[Tag];
  return <Tag className={cn(style, "text-ink", className)}>{children}</Tag>;
}
AnchorLinkHeading.displayName = "AnchorLink.Heading";

interface AnchorLinkLinkProps {
  visible: boolean;
  copied: boolean;
  onClick: () => void;
  className?: string;
}

function AnchorLinkLink({ visible, copied, onClick, className }: AnchorLinkLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "transition-all duration-150",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        className,
      )}
      aria-label="Copy link to heading"
    >
      <span className="relative inline-flex items-center justify-center w-6 h-6">
        {copied ? (
          <span className="relative inline-flex items-center rounded px-1.5 py-0.5 font-architect text-[10px] text-green-700 bg-green-50 whitespace-nowrap">
            <SketchBorder stroke="#7cb88a" strokeWidth={0.8} radius={4} roughness={1} />
            <span className="relative z-[1]">Copied!</span>
          </span>
        ) : (
          <span className="relative inline-flex items-center justify-center rounded p-0.5 hover:bg-[#f0efed]/60">
            <AnchorLinkIcon />
          </span>
        )}
      </span>
    </button>
  );
}
AnchorLinkLink.displayName = "AnchorLink.Link";

interface AnchorLinkIconProps {
  size?: number;
  className?: string;
}

function AnchorLinkIcon({ size = 14, className }: AnchorLinkIconProps) {
  return (
    <Link2
      size={size}
      className={cn("text-ink-muted/35 group-hover:text-ink-muted/70 transition-colors", className)}
    />
  );
}
AnchorLinkIcon.displayName = "AnchorLink.Icon";

export const AnchorLink = Object.assign(AnchorLinkRoot, {
  Heading: AnchorLinkHeading,
  Link: AnchorLinkLink,
  Icon: AnchorLinkIcon,
});

export type { AnchorLinkRootProps as AnchorLinkProps, HeadingAs as AnchorLinkHeadingAs };
