import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export interface DropdownItem {
  key: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

export interface PaperDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  className?: string;
}

export function PaperDropdown({
  trigger,
  items,
  placement = "bottom-left",
  className,
}: PaperDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleMousedown = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
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
  }, [open]);

  const isTop = placement.startsWith("top");
  const isRight = placement.endsWith("right");

  return (
    <div ref={triggerRef} className="relative inline-block">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>

      {open && (
        <div
          className={cn(
            "absolute z-50 min-w-[180px]",
            isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
            isRight ? "right-0" : "left-0",
            className,
          )}
        >
          <div className="relative">
            <SketchBorder
              fill="#fffdf9"
              stroke="#3a3733"
              strokeWidth={1.6}
              shadow={5}
              radius={8}
              bleed={6}
            />
            <div className="relative z-[1] py-1.5">
              {items.map((item) => {
                if (item.separator) {
                  return <hr key={item.key} className="my-1 border-[#e8e3d8]" />;
                }
                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.disabled) return;
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2.5 text-left",
                      "font-architect text-[14px] transition-colors",
                      item.danger ? "text-[#9f3a36]" : "text-ink",
                      item.disabled
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-black/[0.04]",
                    )}
                  >
                    {item.icon && (
                      <span className="shrink-0">{item.icon}</span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
