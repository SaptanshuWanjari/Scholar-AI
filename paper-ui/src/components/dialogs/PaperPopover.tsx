import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface PaperPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  maxWidth?: number;
  className?: string;
}

interface Pos {
  top: number;
  left: number;
}

function computePos(
  rect: DOMRect,
  popoverEl: HTMLDivElement,
  placement: PaperPopoverProps["placement"],
): Pos {
  const gap = 10;
  const pw = popoverEl.offsetWidth;
  const ph = popoverEl.offsetHeight;

  switch (placement) {
    case "top":
      return {
        top: rect.top + window.scrollY - ph - gap,
        left: rect.left + window.scrollX + rect.width / 2 - pw / 2,
      };
    case "left":
      return {
        top: rect.top + window.scrollY + rect.height / 2 - ph / 2,
        left: rect.left + window.scrollX - pw - gap,
      };
    case "right":
      return {
        top: rect.top + window.scrollY + rect.height / 2 - ph / 2,
        left: rect.right + window.scrollX + gap,
      };
    case "bottom":
    default:
      return {
        top: rect.bottom + window.scrollY + gap,
        left: rect.left + window.scrollX + rect.width / 2 - pw / 2,
      };
  }
}

function Arrow({ placement }: { placement: PaperPopoverProps["placement"] }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    pointerEvents: "none",
  };

  switch (placement) {
    case "top":
      return (
        <span
          style={{
            ...base,
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #3a3733",
          }}
        />
      );
    case "left":
      return (
        <span
          style={{
            ...base,
            right: -6,
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: "6px solid #3a3733",
          }}
        />
      );
    case "right":
      return (
        <span
          style={{
            ...base,
            left: -6,
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: "6px solid #3a3733",
          }}
        />
      );
    case "bottom":
    default:
      return (
        <span
          style={{
            ...base,
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: "6px solid #3a3733",
          }}
        />
      );
  }
}

export function PaperPopover({
  trigger,
  children,
  placement = "bottom",
  maxWidth = 280,
  className,
}: PaperPopoverProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    if (!open) return;

    const position = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      const el = popoverRef.current;
      if (rect && el) {
        setPos(computePos(rect, el, placement));
      }
    };

    position();

    const handleMousedown = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleMousedown);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [open, placement]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block"
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </span>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className={cn("absolute z-50 p-3", className)}
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              maxWidth,
            }}
          >
            <div className="relative">
              <SketchBorder
                fill="#fffdf9"
                stroke="#3a3733"
                strokeWidth={1.6}
                shadow={4}
                roughness={1.0}
                radius={8}
                bleed={6}
              />
              <Arrow placement={placement} />
              <div className="relative z-[1] px-3 py-2.5 font-kalam text-[14px] text-ink">
                {children}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
