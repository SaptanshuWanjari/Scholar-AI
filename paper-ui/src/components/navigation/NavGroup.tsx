import React, { useState } from "react";
import { cn } from "@paper-ui/utils";
import { PaperPanel } from "@paper-ui/core";
import { PushPin } from "@paper-ui/components/decorations";

interface NavGroupProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function NavGroup({ title, defaultOpen = false, children, className }: NavGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn(className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 cursor-pointer font-architect text-[13px] font-semibold text-ink hover:bg-ink/[0.02] transition-colors"
      >
        <PushPin size={18} position="none" className="shrink-0 -rotate-[15deg]" />
        <span className="flex-1 text-left">{title}</span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 16 16"
          className={cn(
            "shrink-0 text-ink-muted transition-transform duration-200",
            open && "rotate-90",
          )}
          aria-hidden
        >
          <path
            d="M6 3 L11 8 L6 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
}

NavGroup.displayName = "NavGroup";
