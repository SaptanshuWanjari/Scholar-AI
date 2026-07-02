import React, { useEffect, useRef, useState, cloneElement } from "react";
import { createPortal } from "react-dom";

export interface PaperTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

interface Pos {
  top: number;
  left: number;
}

function computePos(
  rect: DOMRect,
  tooltipEl: HTMLDivElement,
  placement: PaperTooltipProps["placement"],
): Pos {
  const gap = 8;
  const tw = tooltipEl.offsetWidth;
  const th = tooltipEl.offsetHeight;

  switch (placement) {
    case "bottom":
      return {
        top: rect.bottom + window.scrollY + gap,
        left: rect.left + window.scrollX + rect.width / 2 - tw / 2,
      };
    case "left":
      return {
        top: rect.top + window.scrollY + rect.height / 2 - th / 2,
        left: rect.left + window.scrollX - tw - gap,
      };
    case "right":
      return {
        top: rect.top + window.scrollY + rect.height / 2 - th / 2,
        left: rect.right + window.scrollX + gap,
      };
    case "top":
    default:
      return {
        top: rect.top + window.scrollY - th - gap,
        left: rect.left + window.scrollX + rect.width / 2 - tw / 2,
      };
  }
}

export function PaperTooltip({
  content,
  children,
  placement = "top",
  delay = 400,
}: PaperTooltipProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    const el = tooltipRef.current;
    if (rect && el) {
      setPos(computePos(rect, el, placement));
    }
  }, [visible, placement]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const child = cloneElement(children as React.ReactElement<any>, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      (children as React.ReactElement<any>).props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      (children as React.ReactElement<any>).props.onMouseLeave?.(e);
    },
  });

  return (
    <>
      {child}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex: 9999,
              background: "#262320",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "4px 10px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-architect, sans-serif)",
              fontSize: "0.8rem",
              color: "#fbf8f2",
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
