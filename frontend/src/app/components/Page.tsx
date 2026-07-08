import type { ReactNode } from "react";
import { cn } from "./ui/utils";

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth">
      <div className={cn("mx-auto w-full max-w-7xl px-6 py-6", className)}>
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-lg font-kalam font-semibold text-foreground uppercase tracking-wider text-[11px]">{title}</h3>
      {action}
    </div>
  );
}
