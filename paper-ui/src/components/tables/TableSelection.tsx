import React from "react";
import { CheckSquare, Square, X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}

function SelectionCheckbox({
  checked,
  onChange,
  indeterminate,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center justify-center p-0.5 transition-colors hover:text-ink text-ink-muted",
        className,
      )}
      aria-label={checked ? "Deselect" : "Select"}
    >
      {checked || indeterminate ? (
        <CheckSquare size={18} strokeWidth={1.6} className="text-[#3a3733]" />
      ) : (
        <Square size={18} strokeWidth={1.6} />
      )}
    </button>
  );
}

interface ToolbarProps {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
  className?: string;
}

function SelectionToolbar({
  count,
  onClear,
  children,
  className,
}: ToolbarProps) {
  return (
    <div className={cn("sticky top-0 z-40 mb-3", className)}>
      <div className="relative">
        <SketchBorder
          fill="#f0ede4"
          stroke="#3a3733"
          strokeWidth={1.4}
          radius={6}
          shadow={3}
          roughness={1.1}
          bleed={6}
        />
        <div className="relative z-[1] flex items-center gap-3 px-4 py-2.5">
          <span className="font-architect text-[13px] text-ink font-medium">
            {count} selected
          </span>
          <button
            type="button"
            onClick={onClear}
            className="font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
          >
            Clear
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

SelectionCheckbox.displayName = "TableSelection.Checkbox";
SelectionToolbar.displayName = "TableSelection.Toolbar";

export const TableSelection = {
  Checkbox: SelectionCheckbox,
  Toolbar: SelectionToolbar,
};
