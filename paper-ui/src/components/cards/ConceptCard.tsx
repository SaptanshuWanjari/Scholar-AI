import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

// ─── Rough rect path helper ───────────────────────────────────────────────────

function roundRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const cr = Math.max(0, Math.min(r, w / 2, h / 2));
  return (
    `M${x + cr},${y} L${x + w - cr},${y} Q${x + w},${y} ${x + w},${y + cr} ` +
    `L${x + w},${y + h - cr} Q${x + w},${y + h} ${x + w - cr},${y + h} ` +
    `L${x + cr},${y + h} Q${x},${y + h} ${x},${y + h - cr} ` +
    `L${x},${y + cr} Q${x},${y} ${x + cr},${y} Z`
  );
}

// ─── SketchFace ───────────────────────────────────────────────────────────────
// Lightweight rough.js surface drawn directly into an SVG — no CSS filter,
// no PaperCard wrapper. This keeps the 3D stacking context clean for the flip.

interface SketchFaceProps {
  fill?: string;
  seed?: number;
  children?: React.ReactNode;
  className?: string;
}

function SketchFace({ fill = "#fffdf9", seed = 1, children, className }: SketchFaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const draw = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (!w || !h) return;

      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const pad = 3;
      const rc = rough.svg(svg);
      const el = rc.path(roundRectPath(pad, pad, w - pad * 2, h - pad * 2, 7), {
        fill,
        fillStyle: "solid",
        stroke: "#262320",
        strokeWidth: 1.5,
        roughness: 1.1,
        bowing: 0.8,
        seed,
      });
      svg.appendChild(el);
    };

    const ro = new ResizeObserver(draw);
    ro.observe(container);
    draw();
    return () => ro.disconnect();
  }, [fill, seed]);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 overflow-visible"
        aria-hidden
      />
      <div className="relative z-[1] flex h-full flex-col">{children}</div>
    </div>
  );
}

// ─── Type badge (BASIC / DEFINITION / etc.) ──────────────────────────────────

const TYPE_COLORS: Record<string, { stroke: string; fg: string }> = {
  DEFINITION: { stroke: "#9f3a36", fg: "#9f3a36" },
  BASIC:      { stroke: "#3a3733", fg: "#3a3733" },
  MEDIUM:     { stroke: "#a3771f", fg: "#a3771f" },
  HARD:       { stroke: "#6f63a3", fg: "#6f63a3" },
  REVIEW:     { stroke: "#4a6f91", fg: "#4a6f91" },
};

function TypeBadge({ type }: { type: string }) {
  const t = TYPE_COLORS[type.toUpperCase()] ?? TYPE_COLORS.BASIC;
  return (
    <span
      className="relative inline-flex items-center px-2.5 py-0.5 font-architect text-[11px] font-medium tracking-wide"
      style={{ color: t.fg }}
    >
      <SketchBorder stroke={t.stroke} strokeWidth={1.3} radius={4} roughness={1.2} shadow={0} bleed={4} />
      <span className="relative z-[1]">{type.toUpperCase()}</span>
    </span>
  );
}

// ─── Status pill ─────────────────────────────────────────────────────────────

type CardStatus = "new" | "due" | "learning" | "mastered" | "again";

const STATUS_STYLES: Record<CardStatus, { label: string; color: string }> = {
  new:      { label: "new",       color: "#79736a" },
  due:      { label: "Due Today", color: "#9f3a36" },
  learning: { label: "learning",  color: "#a3771f" },
  mastered: { label: "mastered",  color: "#3f7a4e" },
  again:    { label: "again",     color: "#9f3a36" },
};

function StatusPill({ status }: { status: CardStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="relative inline-flex items-center px-2.5 py-0.5 font-architect text-[11px]"
      style={{ color: s.color }}
    >
      <SketchBorder stroke={s.color} strokeWidth={1.2} radius={10} roughness={1.0} shadow={0} bleed={4} />
      <span className="relative z-[1]">{s.label}</span>
    </span>
  );
}

// ─── ConceptCard ──────────────────────────────────────────────────────────────

export interface ConceptCardProps {
  /** Front face — the question or term. */
  front: string;
  /** Back face — the answer or definition. */
  back?: string;
  type?: string;
  status?: CardStatus;
  course?: string;
  /** Controlled flip state. */
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  onRate?: (rating: "again" | "hard" | "good" | "easy") => void;
  className?: string;
}

/**
 * Flashcard with a CSS 3D perspective flip powered by motion/react.
 *
 * Follows the exact pattern used by FlashcardCard in this codebase:
 *   - perspective on the outer container
 *   - motion.div with animate={{ rotateY }} + spring transition
 *   - [transform-style:preserve-3d] on the motion div
 *   - both faces absolute inset-0 with [backface-visibility:hidden]
 *   - back face pre-rotated with [transform:rotateY(180deg)]
 *   - z-index swap so the visible face receives pointer events
 *
 * The card surface is a raw rough.js SVG (no PaperCard / CSS filter) so it
 * doesn't interfere with the 3D stacking context.
 */
export function ConceptCard({
  front,
  back,
  type = "BASIC",
  status = "new",
  course,
  flipped: controlledFlipped,
  onFlip,
  onRate,
  className,
}: ConceptCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = controlledFlipped !== undefined;
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;

  const handleFlip = () => {
    if (!back) return;
    const next = !isFlipped;
    if (!isControlled) setInternalFlipped(next);
    onFlip?.(next);
  };

  return (
    <div
      className={cn("relative h-48", back && "cursor-pointer select-none", className)}
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative size-full [transform-style:preserve-3d]"
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ zIndex: isFlipped ? 0 : 1 }}
        >
          <SketchFace fill="#fffdf9" seed={17} className="px-4 pb-4 pt-3">
            {/* Header: type badge + status pill */}
            <div className="flex items-center justify-between gap-2">
              <TypeBadge type={type} />
              <StatusPill status={status} />
            </div>

            {/* Body */}
            <div className="flex flex-1 items-center py-2">
              <p className="font-kalam text-[15px] leading-relaxed text-ink">{front}</p>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between">
              {course && (
                <p className="font-architect text-[10px] uppercase tracking-[0.14em] text-ink-muted/60">
                  {course}
                </p>
              )}
              <p className="ml-auto font-architect text-[10px] text-ink-muted/40">tap to flip</p>
            </div>
          </SketchFace>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ zIndex: isFlipped ? 1 : 0 }}
        >
          <SketchFace fill="#f5f1ec" seed={42} className="px-4 pb-4 pt-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <TypeBadge type={type} />
              <StatusPill status={status} />
            </div>

            {/* Body */}
            <div className="flex flex-1 items-center py-2">
              <p className="font-kalam text-[15px] leading-relaxed text-ink">{back ?? ""}</p>
            </div>

            {/* Rating row */}
            <div className="mt-auto">
              {onRate && (
                <div
                  className="mb-2 flex items-center gap-1.5 border-t border-black/[0.05] pt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(["again", "hard", "good", "easy"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => onRate(r)}
                      className={cn(
                        "flex-1 rounded py-0.5 font-architect text-[11px] transition-opacity hover:opacity-80",
                        r === "again" && "bg-[rgba(159,58,54,0.1)] text-[#9f3a36]",
                        r === "hard"  && "bg-[rgba(163,119,31,0.1)] text-[#a3771f]",
                        r === "good"  && "bg-[rgba(63,122,78,0.1)] text-[#3f7a4e]",
                        r === "easy"  && "bg-[rgba(74,111,145,0.1)] text-[#4a6f91]",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
              {course && (
                <p className="font-architect text-[10px] uppercase tracking-[0.14em] text-ink-muted/60">
                  {course}
                </p>
              )}
            </div>
          </SketchFace>
        </div>
      </motion.div>
    </div>
  );
}
