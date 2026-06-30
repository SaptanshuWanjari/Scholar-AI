import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export interface PaperValidationSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  errors: string[];
  title?: string;
}

export const PaperValidationSummary = React.forwardRef<HTMLDivElement, PaperValidationSummaryProps>(
  function PaperValidationSummary({ errors, title = "Please fix the following errors", className, ...props }, ref) {
    if (!errors || errors.length === 0) return null;

    return (
      <div ref={ref} className={cn("relative p-4 my-4", className)} {...props}>
        <SketchBorder
          fill="#fee2e2"
          stroke="#9f3a36"
          strokeWidth={1.5}
          roughness={1.5}
          shadow={0}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-danger">
            <AlertTriangle size={18} />
            <span className="font-architect font-bold text-[15px]">{title}</span>
          </div>
          <ul className="list-disc list-inside font-kalam text-[14px] text-danger/80 space-y-1 ml-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);

export interface PaperFieldValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  isValid?: boolean;
  isValidating?: boolean;
  message?: string;
}

export const PaperFieldValidation = React.forwardRef<HTMLDivElement, PaperFieldValidationProps>(
  function PaperFieldValidation({ isValid, isValidating, message, className, ...props }, ref) {
    if (isValid === undefined && !isValidating && !message) return null;

    return (
      <div ref={ref} className={cn("flex items-center gap-1.5 mt-1", className)} {...props}>
        {isValidating && (
          <div className="w-3 h-3 rounded-full border-2 border-ink-muted/30 border-t-ink-muted animate-spin" />
        )}
        {isValid && !isValidating && (
          <CheckCircle2 size={14} className="text-[#059669]" />
        )}
        {isValid === false && !isValidating && (
          <AlertTriangle size={14} className="text-danger" />
        )}
        {message && (
          <span className={cn(
            "font-kalam text-[12px]",
            isValid === false ? "text-danger" : isValid === true ? "text-[#059669]" : "text-ink-muted"
          )}>
            {message}
          </span>
        )}
      </div>
    );
  }
);
