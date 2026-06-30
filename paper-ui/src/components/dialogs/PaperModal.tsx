import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface PaperModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  closeOnBackdrop?: boolean;
  className?: string;
}

export function PaperModal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
  closeOnBackdrop = true,
  className,
}: PaperModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn("relative outline-none", className)}
        style={{ width }}
      >
        <SketchBorder
          fill="#fffdf9"
          stroke="#262320"
          strokeWidth={1.8}
          shadow={6}
          radius={10}
          roughness={1.0}
          bleed={6}
        />
        <div className="relative z-[1]">
          {title !== undefined && (
            <div className="flex items-center justify-between border-b border-[#e8e3d8] px-6 py-4">
              <span className="font-architect text-[17px] text-ink">{title}</span>
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
          <div className="px-6 py-5 font-kalam text-[14px] text-ink">{children}</div>
          {footer && (
            <div className="flex justify-end gap-3 border-t border-[#e8e3d8] px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
