import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export interface LanguageSwitcherRootProps {
  languages: Language[];
  current?: string;
  onChange?: (code: string) => void;
  className?: string;
}

function LanguageSwitcherRoot({
  languages,
  current,
  onChange,
  className,
}: LanguageSwitcherRootProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(current ?? languages[0]?.code ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const activeLang = languages.find((l) => l.code === selected) ?? languages[0];

  const handleSelect = useCallback(
    (code: string) => {
      setSelected(code);
      setOpen(false);
      onChange?.(code);
    },
    [onChange],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!activeLang) return null;

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <LanguageSwitcherGlobe onClick={() => setOpen((p) => !p)}>
        <span className="font-architect text-[13px] text-ink-muted">
          {activeLang.code.toUpperCase()}
        </span>
      </LanguageSwitcherGlobe>

      {open && (
        <LanguageSwitcherMenu>
          {languages.map((lang) => (
            <LanguageSwitcherOption
              key={lang.code}
              active={lang.code === selected}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="font-architect text-[13px] font-medium text-ink">
                {lang.nativeName ?? lang.name}
              </span>
              {lang.nativeName && (
                <span className="font-architect text-[11px] text-ink-muted/60">
                  {lang.name}
                </span>
              )}
            </LanguageSwitcherOption>
          ))}
        </LanguageSwitcherMenu>
      )}
    </div>
  );
}
LanguageSwitcherRoot.displayName = "LanguageSwitcher.Root";

interface LanguageSwitcherGlobeProps {
  children?: React.ReactNode;
  size?: number;
  onClick?: () => void;
  className?: string;
}

function LanguageSwitcherGlobe({
  children,
  size = 32,
  onClick,
  className,
}: LanguageSwitcherGlobeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-1 rounded-full px-2",
        "hover:bg-[#f0efed]/50 transition-colors",
        className,
      )}
      style={{ height: size }}
      aria-label="Switch language"
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.55}
        height={size * 0.55}
        className="shrink-0"
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" stroke="#7a7265" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#7a7265" strokeWidth="1.2" />
        <path d="M2 12 L22 12" stroke="#7a7265" strokeWidth="1" />
        <path d="M7.5 6 Q10 8 12 8.5 Q14 9 16.5 6" stroke="#7a7265" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M7.5 18 Q10 16 12 15.5 Q14 15 16.5 18" stroke="#7a7265" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
      {children}
    </button>
  );
}
LanguageSwitcherGlobe.displayName = "LanguageSwitcher.Globe";

interface LanguageSwitcherMenuProps {
  children: React.ReactNode;
  className?: string;
}

function LanguageSwitcherMenu({ children, className }: LanguageSwitcherMenuProps) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 mt-2 z-30 min-w-[160px] rounded-lg overflow-hidden bg-[#fffdf9]",
        className,
      )}
    >
      <SketchBorder
        fill="#fffdf9"
        stroke="#bdb7a8"
        strokeWidth={1.4}
        radius={10}
        roughness={1.1}
        shadow={2}
      />
      <div className="relative z-[1] py-1">{children}</div>
    </div>
  );
}
LanguageSwitcherMenu.displayName = "LanguageSwitcher.Menu";

interface LanguageSwitcherOptionProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

function LanguageSwitcherOption({
  active,
  onClick,
  children,
  className,
}: LanguageSwitcherOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors",
        "hover:bg-[#f4f1ea]",
        active && "bg-[#f0efed]",
        className,
      )}
    >
      {children}
    </button>
  );
}
LanguageSwitcherOption.displayName = "LanguageSwitcher.Option";

export const LanguageSwitcher = Object.assign(LanguageSwitcherRoot, {
  Globe: LanguageSwitcherGlobe,
  Menu: LanguageSwitcherMenu,
  Option: LanguageSwitcherOption,
});

export type { LanguageSwitcherRootProps as LanguageSwitcherProps, Language };
