import React from "react";
import { BookMarked } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SectionLabel } from "@paper-ui/core";
import { PaperBadge } from "../badges/PaperBadge";
import { ArrowDoodle } from "../doodles";

// ─── Spine decoration ─────────────────────────────────────────────────────────
// Drawn as a fixed-width SVG that stretches to the card height.
// Lives at z-[1], between the rough border (z-auto) and content (z-[2]).

function NotebookSpine({ className }: { className?: string }) {
  // We use a viewBox that's tall and narrow. preserveAspectRatio="none"
  // lets it stretch to any card height without distortion.
  const holes = [60, 148, 236, 324, 412];
  return (
    <svg
      className={cn("pointer-events-none absolute bottom-0 left-0 top-0", className)}
      width={44}
      height="100%"
      viewBox="0 0 44 500"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Red margin line */}
      <line
        x1="38" y1="10" x2="38" y2="490"
        stroke="#e85d75" strokeWidth="1.5" opacity="0.6"
        strokeLinecap="round"
      />
      {/* Second faint shadow line for depth */}
      <line
        x1="40" y1="10" x2="40" y2="490"
        stroke="#e85d75" strokeWidth="0.8" opacity="0.3"
        strokeLinecap="round"
      />
      {/* Spiral holes */}
      {holes.map((cy, i) => (
        <g key={i}>
          <ellipse cx="18" cy={cy} rx="7" ry="6" fill="#ebe6dd" opacity="0.95" />
          <ellipse cx="18" cy={cy} rx="7" ry="6"
            fill="none" stroke="#c4bdb0" strokeWidth="1" opacity="0.9" />
          {/* Inner ring gives depth */}
          <ellipse cx="18" cy={cy} rx="4" ry="3.5"
            fill="none" stroke="#b4ad9e" strokeWidth="0.6" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

// ─── NotebookCard ─────────────────────────────────────────────────────────────

export interface NotebookCardProps {
  title: string;
  course?: string;
  blockCount?: number;
  lastEdited?: string;
  preview?: string;
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

/**
 * Notebook tile.
 *
 * Uses SketchBorder directly (instead of PaperCard) so that the spine
 * decoration and folded corner can position themselves against the card's
 * outer boundary — not an inner padded wrapper.
 *
 * Layer order (bottom → top):
 *   0  SketchBorder SVG (rough fill + stroke)
 *   1  NotebookSpine (margin line + spiral holes)
 *   2  Content (title, preview, tags, meta)
 */
export function NotebookCard({
  title,
  course,
  blockCount,
  lastEdited,
  preview,
  tags,
  onClick,
  className,
}: NotebookCardProps) {
  return (
    <div
      className={cn(
        "paper-texture paper-lift relative overflow-visible",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Layer 0 — rough paper surface */}
      <SketchBorder
        fill="#fffdf9"
        stroke="#262320"
        strokeWidth={1.5}
        roughness={1.1}
        shadow={3}
      />

      {/* Layer 1 — spine (margin line + holes) */}
      <NotebookSpine className="z-[1]" />

      {/* Layer 2 — content, padded to clear the spine (44px) */}
      <div className="relative z-[2] pb-5 pl-[56px] pr-5 pt-5">
        <div className="flex items-start gap-2.5">
          <BookMarked
            size={17}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-ink-muted"
          />
          <div className="min-w-0 flex-1">
            {course && <SectionLabel>{course}</SectionLabel>}
            <h3 className="mt-0.5 line-clamp-2 font-caveat text-[26px] font-bold leading-tight text-ink">
              {title}
            </h3>
          </div>
        </div>

        {preview && (
          <p className="mt-2.5 line-clamp-3 font-kalam text-[15px] leading-relaxed text-ink-muted">
            {preview}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <PaperBadge key={tag} tone="ink">
                {tag}
              </PaperBadge>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {blockCount !== undefined && (
              <span className="font-kalam text-[14px] text-ink-muted">
                {blockCount} block{blockCount !== 1 ? "s" : ""}
              </span>
            )}
            {lastEdited && (
              <span className="font-kalam text-[14px] text-ink-muted">
                · {lastEdited}
              </span>
            )}
          </div>
          {onClick && (
            <span className="inline-flex items-center gap-1 font-architect text-[14px] text-ink-muted">
              Open <ArrowDoodle size={14} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
