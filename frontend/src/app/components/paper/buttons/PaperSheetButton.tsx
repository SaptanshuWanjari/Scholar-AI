import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../ui/utils";

export interface PaperSheetButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SVG_W = 600;

function r(n: number) {
  return Math.round(n * 10) / 10;
}

/**
 * Button-specific paper path.
 *
 * Unlike the card paths (top edge at y≈31), here the top edge sits at y≈5
 * so the paper fills the button nearly edge-to-edge. This lets us use fixed
 * pixel padding (not %-of-width) and keeps the button compact at any width.
 *
 * Fold uses proportional offsets (0.84H / 0.96H) so the dog-ear scales
 * correctly at wide-and-short button aspect ratios.
 */
function makePaperPath(H: number): string {
  const yFold = Math.round(H * 0.84);
  const yBot  = Math.round(H * 0.96);
  return [
    // Top edge — near y=0, gentle wobble
    "M 5 6",
    "C 150 3, 300 8, 450 4",
    "C 520 2, 568 7, 595 5",
    // Right side down to fold
    `C 598 ${r(H * 0.28)}, 597 ${r(H * 0.58)}, 595 ${yFold}`,
    // Dog-ear fold corner
    `L 555 ${yBot}`,
    // Bottom edge left
    `C 420 ${r(yBot - H * 0.016)}, 280 ${r(yBot + H * 0.018)}, 150 ${r(yBot - H * 0.010)}`,
    `C 60 ${r(yBot + H * 0.014)}, 8 ${r(yBot - H * 0.008)}, 5 ${yBot}`,
    // Left side back up
    `C 3 ${r(H * 0.58)}, 4 ${r(H * 0.28)}, 5 6 Z`,
  ].join(" ");
}

function makeSecondaryPath(H: number): string {
  const yFold = Math.round(H * 0.842);
  const yBot  = Math.round(H * 0.958);
  return [
    "M 4 8",
    "C 100 5, 280 10, 430 6",
    "C 530 4, 572 9, 596 7",
    `C 598 ${r(H * 0.30)}, 597 ${r(H * 0.60)}, 596 ${yFold}`,
    `L 554 ${yBot}`,
    `C 400 ${r(yBot + H * 0.020)}, 260 ${r(yBot - H * 0.012)}, 120 ${r(yBot + H * 0.014)}`,
    `C 40 ${r(yBot - H * 0.018)}, 6 ${r(yBot + H * 0.010)}, 4 ${yBot}`,
    `C 2 ${r(H * 0.60)}, 3 ${r(H * 0.30)}, 4 8 Z`,
  ].join(" ");
}

/**
 * PaperSheetCard-inspired button.
 *
 * Same dynamic sizing pattern (SVG position:absolute, content in flow,
 * useLayoutEffect + ResizeObserver), but with paths redesigned for a
 * compact button shape and fixed-pixel padding so height tracks content only.
 */
export const PaperSheetButton = React.forwardRef<
  HTMLButtonElement,
  PaperSheetButtonProps
>(function PaperSheetButton(
  {
    children,
    className,
    disabled,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLButtonElement>(null);
  const [svgH, setSvgH] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const setRef = (el: HTMLButtonElement | null) => {
    (innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setSvgH(Math.round((height / width) * SVG_W));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const yFold = Math.round(svgH * 0.84);
  const yBot  = Math.round(svgH * 0.96);

  const shadow = pressed
    ? "drop-shadow(1px 2px 4px rgba(0,0,0,0.15))"
    : hovered
    ? "drop-shadow(5px 10px 18px rgba(0,0,0,0.32))"
    : "drop-shadow(3px 8px 12px rgba(0,0,0,0.28))";

  return (
    <button
      ref={setRef}
      disabled={disabled}
      {...rest}
      className={cn("relative overflow-visible", className)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        filter: shadow,
        transform: pressed
          ? "translateY(2px)"
          : hovered
          ? "translateY(-1px)"
          : undefined,
        transition: "filter 0.15s ease, transform 0.12s ease",
        opacity: disabled ? 0.5 : 1,
        outline: "none",
      }}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); setPressed(false); onMouseLeave?.(e); }}
      onMouseDown={(e) => { setPressed(true); onMouseDown?.(e); }}
      onMouseUp={(e) => { setPressed(false); onMouseUp?.(e); }}
    >
      {/* SVG paper background — absolutely positioned, never affects layout */}
      {svgH > 20 && (
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <path
            d={makePaperPath(svgH)}
            fill="#FDFDF9"
            stroke="#3D3D3D"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={makeSecondaryPath(svgH)}
            fill="none"
            stroke="#3D3D3D"
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Fold shadow */}
          <polygon
            points={`557,${yFold + 1} 555,${yBot} 595,${yFold}`}
            fill="rgba(0,0,0,0.08)"
          />
          {/* Folded flap */}
          <path
            d={`M 595 ${yFold} L 555 ${yBot} L 555 ${yFold} Z`}
            fill="#F4F4F0"
            stroke="#3D3D3D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Label — in flow, its height drives svgH via ResizeObserver.
          Fixed-pixel padding keeps the button compact at all widths. */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          padding: "8px 16px 16px",
          fontFamily: "'Kalam', cursive",
          fontSize: "16px",
          color: "#2d2d2d",
          lineHeight: 1.4,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </button>
  );
});
