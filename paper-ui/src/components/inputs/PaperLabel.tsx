import React from 'react';
import { cn } from '@paper-ui/utils';

export interface PaperLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const PaperLabel = React.forwardRef<HTMLLabelElement, PaperLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-[var(--paper-ink)] select-none', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-[var(--paper-danger)]">*</span>}
    </label>
  ),
);
PaperLabel.displayName = 'PaperLabel';
