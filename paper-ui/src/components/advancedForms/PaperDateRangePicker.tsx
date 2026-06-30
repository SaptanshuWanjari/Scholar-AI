import React, { useState, useRef, useEffect } from "react";
import { cn } from "@paper-ui/utils";
import { PaperInput } from "../inputs/PaperInput";
import { PaperCalendar } from "./PaperCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export interface PaperDateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  startDate?: Date;
  endDate?: Date;
  onChange?: (range: { startDate?: Date; endDate?: Date }) => void;
  label?: string;
  error?: string;
  hint?: string;
}

export const PaperDateRangePicker = React.forwardRef<HTMLDivElement, PaperDateRangePickerProps>(
  function PaperDateRangePicker({ startDate, endDate, onChange, label, error, hint, className, ...props }, ref) {
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

    const handleStartDateSelect = (date: Date) => {
      onChange?.({ startDate: date, endDate });
    };

    const handleEndDateSelect = (date: Date) => {
      onChange?.({ startDate, endDate: date });
    };

    const format = (date?: Date) => date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : "";
    const valueStr = startDate || endDate ? `${format(startDate)} - ${format(endDate)}` : "";

    return (
      <div ref={containerRef} className={cn("relative inline-block w-full", className)} {...props}>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          <PaperInput
            label={label}
            error={error}
            hint={hint}
            readOnly
            value={valueStr}
            placeholder="Select date range..."
            trailingIcon={<CalendarIcon size={18} />}
            className="cursor-pointer"
          />
        </div>
        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-2 flex flex-col sm:flex-row gap-4 bg-[#fffdf9] p-2 rounded-md shadow-lg border border-ink/10">
            <div>
              <div className="font-architect text-[13px] text-ink-muted mb-1 px-4">Start Date</div>
              <PaperCalendar value={startDate} onChange={handleStartDateSelect} />
            </div>
            <div>
              <div className="font-architect text-[13px] text-ink-muted mb-1 px-4">End Date</div>
              <PaperCalendar value={endDate} onChange={handleEndDateSelect} />
            </div>
          </div>
        )}
      </div>
    );
  }
);
