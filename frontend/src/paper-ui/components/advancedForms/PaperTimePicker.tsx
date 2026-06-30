import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/paper-ui/utils";
import { PaperInput } from "../inputs/PaperInput";
import { Clock } from "lucide-react";
import { SketchBorder } from "@/paper-ui/core";

export interface PaperTimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (time: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const PaperTimePicker = React.forwardRef<HTMLInputElement, PaperTimePickerProps>(
  function PaperTimePicker({ value, onChange, label, error, hint, wrapperClassName, className, ...props }, ref) {
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

    const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
    const minutes = ["00", "15", "30", "45"];
    const periods = ["AM", "PM"];

    const handleTimeSelect = (hour: number, minute: string, period: string) => {
      onChange?.(`${hour}:${minute} ${period}`);
      setIsOpen(false);
    };

    return (
      <div ref={containerRef} className={cn("relative inline-block w-full", wrapperClassName)}>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          <PaperInput
            ref={ref}
            label={label}
            error={error}
            hint={hint}
            readOnly
            value={value || ""}
            placeholder={props.placeholder || "Select time..."}
            trailingIcon={<Clock size={18} />}
            className={cn("cursor-pointer", className)}
            {...props}
          />
        </div>
        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-2 p-3 bg-[#fffdf9] flex gap-2 max-h-64 overflow-hidden">
            <SketchBorder
              fill="#fffdf9"
              stroke="#9c9484"
              strokeWidth={1.5}
              roughness={1.1}
              shadow={0}
            />
            <div className="relative z-10 flex gap-4">
              <div className="flex flex-col h-48 overflow-y-auto no-scrollbar pr-2">
                {hours.map(h => (
                  <button
                    key={`h-${h}`}
                    type="button"
                    onClick={() => handleTimeSelect(h, "00", "AM")}
                    className="p-1 px-3 text-left hover:bg-ink/5 rounded-md font-architect text-ink"
                  >
                    {h}
                  </button>
                ))}
              </div>
              <div className="flex flex-col h-48 overflow-y-auto no-scrollbar pr-2">
                {minutes.map(m => (
                  <button
                    key={`m-${m}`}
                    type="button"
                    onClick={() => handleTimeSelect(12, m, "AM")}
                    className="p-1 px-3 text-left hover:bg-ink/5 rounded-md font-architect text-ink"
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex flex-col pr-2">
                {periods.map(p => (
                  <button
                    key={`p-${p}`}
                    type="button"
                    onClick={() => handleTimeSelect(12, "00", p)}
                    className="p-1 px-3 text-left hover:bg-ink/5 rounded-md font-architect text-ink"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
