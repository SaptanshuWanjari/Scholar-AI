import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperPanel } from "@paper-ui/core";

export type EmptyIllustration = "notebook" | "search" | "inbox" | "sparkle";

export interface IllustratedEmptyStateProps {
  illustration: EmptyIllustration;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const ILLUSTRATIONS: Record<EmptyIllustration, React.ReactNode> = {
  notebook: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect x="12" y="20" width="72" height="56" rx="3" stroke="#3a3733" strokeWidth="1.5"/>
      <line x1="48" y1="20" x2="48" y2="76" stroke="#3a3733" strokeWidth="1.2" strokeDasharray="2 2"/>
      <line x1="20" y1="34" x2="42" y2="34" stroke="#b4ad9e" strokeWidth="1.2"/>
      <line x1="20" y1="42" x2="42" y2="42" stroke="#b4ad9e" strokeWidth="1.2"/>
      <line x1="20" y1="50" x2="36" y2="50" stroke="#b4ad9e" strokeWidth="1.2"/>
      <line x1="54" y1="34" x2="76" y2="34" stroke="#b4ad9e" strokeWidth="1.2"/>
      <line x1="54" y1="42" x2="76" y2="42" stroke="#b4ad9e" strokeWidth="1.2"/>
      <line x1="54" y1="50" x2="68" y2="50" stroke="#b4ad9e" strokeWidth="1.2"/>
    </svg>
  ),
  search: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <circle cx="40" cy="38" r="20" stroke="#3a3733" strokeWidth="1.5"/>
      <line x1="54" y1="54" x2="76" y2="76" stroke="#3a3733" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="48" y2="32" stroke="#b4ad9e" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="44" y2="38" stroke="#b4ad9e" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  inbox: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect x="14" y="52" width="68" height="24" rx="2" stroke="#3a3733" strokeWidth="1.5"/>
      <path d="M14 52 L28 32 H68 L82 52" stroke="#3a3733" strokeWidth="1.5" fill="none"/>
      <line x1="36" y1="64" x2="60" y2="64" stroke="#b4ad9e" strokeWidth="1.2"/>
    </svg>
  ),
  sparkle: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <path d="M48 16 L51 30 L65 33 L51 36 L48 50 L45 36 L31 33 L45 30 Z" stroke="#3a3733" strokeWidth="1.4" fill="none"/>
      <path d="M72 54 L74 62 L82 64 L74 66 L72 74 L70 66 L62 64 L70 62 Z" stroke="#b4ad9e" strokeWidth="1.2" fill="none"/>
      <path d="M26 58 L27 63 L32 64 L27 65 L26 70 L25 65 L20 64 L25 63 Z" stroke="#b4ad9e" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
};

export function IllustratedEmptyState({
  illustration,
  title,
  description,
  action,
  className,
}: IllustratedEmptyStateProps) {
  return (
    <PaperPanel className={cn(className)}>
      <div className="flex flex-col items-center py-12 px-6 text-center">
        {ILLUSTRATIONS[illustration]}
        <p className="font-architect text-[17px] text-ink mt-5">{title}</p>
        {description && (
          <p className="font-kalam text-[14px] text-ink-muted mt-2 max-w-[300px]">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </PaperPanel>
  );
}
