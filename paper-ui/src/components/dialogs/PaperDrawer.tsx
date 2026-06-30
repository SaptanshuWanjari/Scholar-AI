import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface PaperDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function PaperDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  width = 380,
  height = 320,
  className,
}: PaperDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onMouseDown={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed z-50 flex flex-col transition-transform duration-300",

          // Position
          side === "right" && "top-0 bottom-0 right-0",
          side === "left" && "top-0 bottom-0 left-0",
          side === "top" && "top-0 left-0 right-0",
          side === "bottom" && "bottom-0 left-0 right-0",

          // Animation
          open
            ? "translate-x-0 translate-y-0"
            : side === "right"
              ? "translate-x-full"
              : side === "left"
                ? "-translate-x-full"
                : side === "top"
                  ? "-translate-y-full"
                  : "translate-y-full",

          className,
        )}
        style={side === "left" || side === "right" ? { width } : { height }}
      >
        <SketchBorder
          fill="#fffdf9"
          stroke="#3a3733"
          strokeWidth={1.6}
          shadow={8}
          radius={0}
          bleed={4}
        />

        <div className="relative z-1 flex h-full flex-col">
          {title && (
            <div className="flex shrink-0 items-center justify-between border-b border-[#e8e3d8] px-6 py-4">
              <span className="font-architect text-[17px] text-ink">
                {title}
              </span>

              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center text-ink-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-5 font-kalam text-[14px] text-ink">
            {children}
          </div>

          {footer && (
            <div className="flex shrink-0 justify-end gap-3 border-t border-[#e8e3d8] px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
