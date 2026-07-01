import React, { useRef, useEffect, useState } from "react";
import { cn } from "@paper-ui/utils";

interface NavCollapseProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export function NavCollapse({ open, children, className }: NavCollapseProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open, children]);

  return (
    <div
      className={cn("overflow-hidden transition-[max-height] duration-250 ease-out", className)}
      style={{ maxHeight: maxHeight ?? 0 }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

NavCollapse.displayName = "NavCollapse";
