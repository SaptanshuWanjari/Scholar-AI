import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/paper-ui/utils";
import { PaperInput } from "../inputs/PaperInput";
import { PaperCalendar } from "./PaperCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export interface PaperDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const PaperDatePicker = React.forwardRef<HTMLInputElement, PaperDatePickerProps>(
  function PaperDatePicker({ value, onChange, label, error, hint, wrapperClassName, className, ...props }, ref) {
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

    const handleDateSelect = (date: Date) => {
      onChange?.(date);
      setIsOpen(false);
    };

    const formattedDate = value ? `${value.getMonth() + 1}/${value.getDate()}/${value.getFullYear()}` : "";

    return (
      <div ref={containerRef} className={cn("relative inline-block w-full", wrapperClassName)}>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          <PaperInput
            ref={ref}
            label={label}
            error={error}
            hint={hint}
            readOnly
            value={formattedDate}
            placeholder={props.placeholder || "Select date..."}
            trailingIcon={<CalendarIcon size={18} />}
            className={cn("cursor-pointer", className)}
            {...props}
          />
        </div>
        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-2">
            <PaperCalendar value={value} onChange={handleDateSelect} className="bg-[#fffdf9]" />
          </div>
        )}
      </div>
    );
  }
);
