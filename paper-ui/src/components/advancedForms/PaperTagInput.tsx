import React, { useState } from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { X } from "lucide-react";

export interface PaperTagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const PaperTagInput = React.forwardRef<HTMLInputElement, PaperTagInputProps>(
  function PaperTagInput({ tags, onChangeTags, label, error, hint, className, wrapperClassName, id, ...props }, ref) {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim() !== "") {
        e.preventDefault();
        if (!tags.includes(inputValue.trim())) {
          onChangeTags([...tags, inputValue.trim()]);
        }
        setInputValue("");
      } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
        onChangeTags(tags.slice(0, -1));
      }
    };

    const removeTag = (indexToRemove: number) => {
      onChangeTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="font-architect text-[13px] text-ink-muted">
            {label}
          </label>
        )}
        <div className={cn("relative flex flex-wrap items-center gap-2 px-3 py-2 min-h-[44px]", className)}>
          <SketchBorder
            fill="#fffdf9"
            stroke={error ? "#9f3a36" : focused ? "#262320" : "#9c9484"}
            strokeWidth={focused ? 1.8 : 1.5}
            roughness={1.1}
            shadow={0}
          />

          <div className="relative z-[1] flex flex-wrap gap-2 w-full">
            {tags.map((tag, index) => (
              <span key={index} className="relative inline-flex items-center gap-1 px-2 py-0.5 text-sm font-architect text-ink">
                <SketchBorder
                  fill="#fcd34d"
                  stroke="#262320"
                  strokeWidth={1}
                  roughness={1.5}
                  shadow={0}
                  className="-z-10"
                />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:text-danger focus:outline-none"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <input
              ref={ref}
              id={inputId}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
              className="flex-1 min-w-[80px] border-none bg-transparent font-architect text-[15px] text-ink placeholder:font-architect placeholder:text-ink-muted/60 focus:outline-none"
              {...props}
            />
          </div>
        </div>
        {error && (
          <p className="font-kalam text-[12px] text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="font-kalam text-[12px] text-ink-muted/70">{hint}</p>
        )}
      </div>
    );
  }
);
