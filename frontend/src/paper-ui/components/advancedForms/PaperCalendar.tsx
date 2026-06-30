import React, { useState } from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaperCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
}

export const PaperCalendar = React.forwardRef<HTMLDivElement, PaperCalendarProps>(
  function PaperCalendar({ value, onChange, className, ...props }, ref) {
    const [currentDate, setCurrentDate] = useState(value || new Date());
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
      const newDate = new Date(year, month, day);
      onChange?.(newDate);
    };

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = value && value.getDate() === d && value.getMonth() === month && value.getFullYear() === year;
      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateClick(d)}
          className={cn(
            "relative w-8 h-8 flex items-center justify-center font-architect text-[15px] hover:text-ink focus:outline-none transition-colors",
            isSelected ? "text-ink font-bold" : "text-ink-muted hover:bg-ink/5 rounded-md"
          )}
        >
          {isSelected && (
            <SketchBorder
              fill="#fcd34d"
              stroke="#262320"
              strokeWidth={1.5}
              roughness={1.5}
              shadow={0}
              className="-z-10"
            />
          )}
          <span className="relative z-10">{d}</span>
        </button>
      );
    }

    return (
      <div ref={ref} className={cn("inline-block p-4 relative", className)} {...props}>
        <SketchBorder
          fill="#fffdf9"
          stroke="#9c9484"
          strokeWidth={1.5}
          roughness={1.1}
          shadow={0}
        />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-ink/5 rounded-md text-ink-muted hover:text-ink transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="font-architect font-bold text-ink">
              {monthNames[month]} {year}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-ink/5 rounded-md text-ink-muted hover:text-ink transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="font-kalam text-[13px] text-ink-muted/70 w-8">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>
      </div>
    );
  }
);
