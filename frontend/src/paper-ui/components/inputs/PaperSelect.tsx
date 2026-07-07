import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface PaperSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  /** When true, shows a "Use '…' as custom value" entry when search text doesn't match any option */
  allowCustom?: boolean;
}

export function PaperSelect({
  value,
  defaultValue,
  onChange,
  options,
  placeholder = "Select an option…",
  label,
  error,
  hint,
  disabled = false,
  className,
  wrapperClassName,
  icon,
  searchable = false,
  allowCustom = false,
}: PaperSelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? (value as string) : internal;

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const generatedId = React.useId();

  const selected = options.find((o) => o.value === current);
  // For custom values not in the options list, display the raw value
  const displayLabel = selected?.label ?? (current || null);

  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePos = useCallback(() => {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const dropdownEl = dropdownRef.current;
      const dropdownHeight = dropdownEl ? dropdownEl.getBoundingClientRect().height : 220;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + 6;
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 6;
      }

      setPos({ top, left: rect.left, width: rect.width });
    }
  }, []);

  const setDropdownRef = useCallback((node: HTMLDivElement | null) => {
    dropdownRef.current = node;
    if (node) {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (rect) {
        const dropdownHeight = node.getBoundingClientRect().height;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        let top = rect.bottom + 6;
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          top = rect.top - dropdownHeight - 6;
        }
        setPos({ top, left: rect.left, width: rect.width });
      }
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      return;
    }
    updatePos();
  }, [open, updatePos]);

  // Close on outside click, but exclude the portal dropdown itself
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Reposition on scroll or resize so the dropdown tracks the trigger
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  const pick = (val: string) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
    setOpen(false);
  };

  const filteredOptions = searchQuery
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.value.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  const showCustomEntry =
    allowCustom &&
    searchQuery.trim().length > 0 &&
    !options.some(
      (o) =>
        o.value === searchQuery.trim() ||
        o.label.toLowerCase() === searchQuery.trim().toLowerCase(),
    );

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={generatedId} className="font-architect text-[13px] text-ink-muted">
          {label}
        </label>
      )}

      <div ref={wrapRef} className="relative">
        {/* Trigger */}
        <button
          id={generatedId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((o) => !o)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "relative flex w-full items-center justify-between gap-2 px-3 py-2 text-left",
            "font-architect text-[15px]",
            "transition-opacity",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <SketchBorder
            fill="#fffdf9"
            stroke={error ? "#9f3a36" : open || focused ? "#262320" : "#9c9484"}
            strokeWidth={open || focused ? 1.8 : 1.5}
            roughness={1.1}
            shadow={0}
          />
          {icon && <span className="relative z-[1] shrink-0">{icon}</span>}
          <span className={cn("relative z-[1] flex-1 truncate", !displayLabel && "text-ink-muted/60")}>
            {displayLabel ?? placeholder}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "relative z-[1] shrink-0 text-ink-muted transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown — rendered in a portal so no parent overflow/stacking can clip it */}
        {open && createPortal(
          <div
            ref={setDropdownRef}
            className="fixed z-[9999]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {/* Solid CSS background prevents rough.js hatch gaps from showing content underneath */}
            <div className="relative animate-in fade-in zoom-in-95 duration-100" style={{ backgroundColor: "#fffdf9" }}>
              <SketchBorder
                fill="#fffdf9"
                stroke="#3a3733"
                strokeWidth={1.6}
                roughness={1.0}
                shadow={4}
                shadowColor="rgba(0,0,0,0.18)"
              />
              <div className="relative z-[1] flex flex-col max-h-52">
                {searchable && (
                  <div className="px-2 py-2 border-b border-[#e8e3d8] flex items-center gap-1.5 bg-[#faf6ee]">
                    <Search size={13} className="text-ink-muted shrink-0" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent font-architect text-[13px] text-ink outline-none"
                    />
                  </div>
                )}
                <div
                  role="listbox"
                  className="flex-1 overflow-y-auto py-1.5"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#d4cfc2 transparent" }}
                >
                  {filteredOptions.length === 0 && !showCustomEntry && (
                    <p className="px-4 py-3 font-kalam text-[13px] text-ink-muted/60">
                      No options
                    </p>
                  )}
                  {filteredOptions.map((opt) => {
                    const isSelected = opt.value === current;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => pick(opt.value)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left",
                          "font-architect text-[14px] text-ink transition-colors",
                          isSelected
                            ? "bg-black/[0.05]"
                            : "hover:bg-black/[0.03]",
                        )}
                      >
                        {opt.icon && (
                          <span className="shrink-0 text-ink-muted/80">{opt.icon}</span>
                        )}
                        <span className="flex-1 truncate">{opt.label}</span>
                        {isSelected && (
                          <Check size={13} className="shrink-0 text-ink-muted" />
                        )}
                      </button>
                    );
                  })}
                  {showCustomEntry && (
                    <button
                      type="button"
                      role="option"
                      onClick={() => pick(searchQuery.trim())}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left font-kalam text-[13px] text-ink-muted hover:bg-black/[0.03] transition-colors"
                    >
                      Use{" "}
                      <span className="font-mono text-ink">"{searchQuery.trim()}"</span>
                      {" "}as custom model ID
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      {error && <p className="font-kalam text-[12px] text-danger">{error}</p>}
      {hint && !error && (
        <p className="font-kalam text-[12px] text-ink-muted/70">{hint}</p>
      )}
    </div>
  );
}

