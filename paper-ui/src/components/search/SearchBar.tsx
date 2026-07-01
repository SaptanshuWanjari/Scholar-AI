import React, { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface ShortcutKeyProps {
  children: React.ReactNode;
  className?: string;
}

export function ShortcutKey({ children, className }: ShortcutKeyProps) {
  return (
    <kbd
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-0.5",
        "font-architect text-xs text-ink-muted",
        className,
      )}
    >
      <SketchBorder stroke="#bdb7a8" strokeWidth={1.2} radius={5} roughness={1.4} />
      <span className="relative z-[1]">{children}</span>
    </kbd>
  );
}

export interface SearchBarRootProps {
  children?: React.ReactNode;
  width?: number | string;
  className?: string;
}

const SearchBarRoot = React.forwardRef<HTMLDivElement, SearchBarRootProps>(
  function SearchBarRoot({ children, width = 420, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative flex min-w-0 items-center gap-2 overflow-hidden px-3 py-2", className)}
        style={{ width }}
      >
        <SketchBorder
          fill="#fffdf9"
          stroke="#b4ad9e"
          strokeWidth={1.5}
          roughness={1.1}
          shadow={0}
          radius={8}
        />
        {children}
      </div>
    );
  },
);
SearchBarRoot.displayName = "SearchBar";

export interface SearchBarInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFocusChange?: (focused: boolean) => void;
}

const SearchBarInput = React.forwardRef<HTMLInputElement, SearchBarInputProps>(
  function SearchBarInput({ className, onFocus, onBlur, onFocusChange, ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        onFocus={(e) => {
          onFocusChange?.(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          onFocusChange?.(false);
          onBlur?.(e);
        }}
        className={cn(
          "relative z-[1] min-w-0 flex-1 border-none bg-transparent font-architect text-[15px] text-ink placeholder:font-architect placeholder:text-ink-muted/70 focus:outline-none",
          className,
        )}
      />
    );
  },
);
SearchBarInput.displayName = "SearchBar.Input";

export interface SearchBarIconProps {
  children?: React.ReactNode;
  className?: string;
}

function SearchBarIcon({ children, className }: SearchBarIconProps) {
  return (
    <span className={cn("relative z-[1] shrink-0 text-ink-muted", className)}>
      {children ?? <Search size={17} />}
    </span>
  );
}
SearchBarIcon.displayName = "SearchBar.Icon";

export interface SearchBarShortcutProps {
  children: React.ReactNode;
  className?: string;
}

function SearchBarShortcut({ children, className }: SearchBarShortcutProps) {
  return (
    <div className={cn("relative z-[1] shrink-0", className)}>
      <ShortcutKey>{children}</ShortcutKey>
    </div>
  );
}
SearchBarShortcut.displayName = "SearchBar.Shortcut";

export interface SearchBarClearProps {
  visible: boolean;
  onClick?: () => void;
  className?: string;
}

function SearchBarClear({ visible, onClick, className }: SearchBarClearProps) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative z-[1] shrink-0 rounded-full p-0.5 text-ink-muted/60 transition-colors hover:text-ink",
        className,
      )}
      aria-label="Clear search"
    >
      <X size={15} />
    </button>
  );
}
SearchBarClear.displayName = "SearchBar.Clear";

export interface SearchBarFilterToggleProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function SearchBarFilterToggle({ active, onClick, className }: SearchBarFilterToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative z-[1] shrink-0 rounded p-0.5 transition-colors",
        active ? "text-ink" : "text-ink-muted/60 hover:text-ink",
        className,
      )}
      aria-label="Toggle filters"
    >
      <SlidersHorizontal size={15} />
    </button>
  );
}
SearchBarFilterToggle.displayName = "SearchBar.FilterToggle";

export const SearchBar = Object.assign(SearchBarRoot, {
  Input: SearchBarInput,
  Icon: SearchBarIcon,
  Shortcut: SearchBarShortcut,
  Clear: SearchBarClear,
  FilterToggle: SearchBarFilterToggle,
});
