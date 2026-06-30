import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/paper-ui/utils";
import { PaperInput } from "../inputs/PaperInput";
import { SketchBorder } from "@/paper-ui/core";
import { Palette } from "lucide-react";

export interface PaperColorPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const PaperColorPicker = React.forwardRef<HTMLInputElement, PaperColorPickerProps>(
  function PaperColorPicker({ value, onChange, label, error, hint, wrapperClassName, className, ...props }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const colors = [
      "#fcd34d", "#f87171", "#fb923c", "#34d399", "#60a5fa", "#a78bfa",
      "#262320", "#9c9484", "#ffffff", "#000000"
    ];

    const handleColorSelect = (color: string) => {
      onChange?.(color);
      setIsOpen(false);
    };

    return (
      <div ref={containerRef} className={cn("relative inline-block w-full", wrapperClassName)}>
        <div className="flex items-end gap-2">
          <div className="relative w-10 h-10 shrink-0 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <SketchBorder
              fill={value || "#ffffff"}
              stroke="#262320"
              strokeWidth={1.5}
              roughness={1.5}
              shadow={0}
            />
          </div>
          <div className="flex-1" onClick={() => setIsOpen(!isOpen)}>
            <PaperInput
              ref={ref}
              label={label}
              error={error}
              hint={hint}
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder="#FFFFFF"
              trailingIcon={<Palette size={18} />}
              className={cn("cursor-pointer", className)}
              {...props}
            />
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-2 p-3 bg-[#fffdf9] max-w-[200px]">
            <SketchBorder
              fill="#fffdf9"
              stroke="#9c9484"
              strokeWidth={1.5}
              roughness={1.1}
              shadow={0}
            />
            <div className="relative z-10 flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className="relative w-6 h-6 hover:scale-110 transition-transform"
                >
                  <SketchBorder
                    fill={color}
                    stroke="#262320"
                    strokeWidth={1.5}
                    roughness={1.2}
                    shadow={0}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
