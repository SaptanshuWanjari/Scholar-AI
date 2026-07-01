import React from "react";
import { cn } from "@paper-ui/utils";

export interface FormSectionProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  title?: string;
  description?: string;
}

export const FormSection = React.forwardRef<HTMLFieldSetElement, FormSectionProps>(
  function FormSection({ title, description, children, className, ...props }, ref) {
    return (
      <fieldset ref={ref} className={cn("mb-8 w-full", className)} {...props}>
        {title && (
          <legend className="font-architect font-bold text-[18px] text-ink mb-1 px-1 relative inline-block">
            {title}
            <div className="absolute -bottom-1 left-0 right-0 h-1">
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full text-ink-muted/30">
                <path d="M0 5 Q 25 10, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </legend>
        )}
        {description && (
          <p className="font-kalam text-[14px] text-ink-muted/80 mb-6 px-1">
            {description}
          </p>
        )}
        <div className="flex flex-col gap-5">
          {children}
        </div>
      </fieldset>
    );
  }
);
