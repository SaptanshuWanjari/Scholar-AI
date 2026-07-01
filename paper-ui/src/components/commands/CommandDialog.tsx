import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { Command } from "./Command";

export interface CommandDialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function CommandDialog({
  open,
  onClose,
  children,
  className,
}: CommandDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLInputElement>('[data-command-dialog] input')?.focus();
      });
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[13vh]"
      style={{
        backgroundColor: "rgba(30,25,18,0.35)",
        backdropFilter: "blur(2px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn("relative w-full max-w-[540px] mx-4", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <SketchBorder
          fill="#fffdf9"
          stroke="#3a3733"
          strokeWidth={1.8}
          roughness={1.2}
          radius={10}
          shadow={12}
          shadowColor="rgba(0,0,0,0.2)"
          bleed={6}
        />
        <div className="relative z-[1]" data-command-dialog>
          <Command noBorder onEscape={onClose}>
            {children}
          </Command>
        </div>
      </div>
    </div>,
    document.body
  );
}
