import React, { cloneElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";
import { type DropdownItem } from "./PaperDropdown";

export interface ContextMenuProps {
  items: DropdownItem[];
  children: React.ReactElement;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    const handleMousedown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  const child = cloneElement(children as React.ReactElement<any>, {
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const menuW = 200;
      const menuH = items.length * 44;
      const x = Math.min(e.clientX, vw - menuW - 8);
      const y = Math.min(e.clientY, vh - menuH - 8);
      setPos({ x, y });
      setOpen(true);
      (children as React.ReactElement<any>).props.onContextMenu?.(e);
    },
  });

  return (
    <>
      {child}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={cn("fixed z-[60] min-w-[180px]", className)}
            style={{ top: pos.y, left: pos.x }}
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
          </div>,
          document.body,
        )}
    </>
  );
}
