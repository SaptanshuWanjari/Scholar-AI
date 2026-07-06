import { SectionLabel } from "@paper-ui/core";

export function SideSection({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#e8e3d8] px-3 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 px-1">
        <Icon className="size-3 text-ink-muted" />
        <SectionLabel className="text-[10px]">{label}</SectionLabel>
      </div>
      {children}
    </div>
  );
}

export function InspectorBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionLabel className="mb-2 block text-[10px]">{title}</SectionLabel>
      {children}
    </div>
  );
}

export function DrawerBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionLabel className="mb-3 block text-sm">{title}</SectionLabel>
      {children}
    </div>
  );
}

export function LegendDot({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 font-architect text-[13px] text-ink">
      <span className={`shrink-0 rounded-full ${cls}`} />
      {label}
    </span>
  );
}
