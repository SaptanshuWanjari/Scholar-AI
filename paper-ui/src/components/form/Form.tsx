import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperCard } from "@paper-ui/core";
import { Tape } from "@paper-ui/components/decorations";
import { FormSection } from "./FormSection";
import { FormGrid } from "./FormGrid";

export interface FormProps extends Omit<React.ComponentPropsWithoutRef<typeof PaperCard>, "onSubmit"> {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  function Form({ children, className, onSubmit, surface = "#fffdf9", shadow = "md", ...props }, ref) {
    return (
      <PaperCard surface={surface} shadow={shadow} className={cn("p-6", className)} {...props}>
        <Tape corner="top-left" />
        <Tape corner="top-right" />
        <form ref={ref} onSubmit={onSubmit} className="relative z-1">
          {children}
        </form>
      </PaperCard>
    );
  }
);

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField({ children, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("mb-5", className)} {...props}>
        {children}
      </div>
    );
  }
);

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel({ children, className, required, optional, ...props }, ref) {
    return (
      <label
        ref={ref}
        className={cn("font-architect text-[14px] font-semibold text-ink mb-1.5 block", className)}
        {...props}
      >
        {children}
        {required && <span className="text-brick ml-0.5">*</span>}
        {optional && !required && (
          <span className="font-kalam text-[12px] text-ink-muted/60 ml-1">(optional)</span>
        )}
      </label>
    );
  }
);

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  function FormDescription({ children, className, ...props }, ref) {
    return (
      <p ref={ref} className={cn("font-kalam text-[12px] text-ink-muted/60 mt-0.5", className)} {...props}>
        {children}
      </p>
    );
  }
);

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  function FormError({ children, className, ...props }, ref) {
    if (!children) return null;
    return (
      <p ref={ref} className={cn("font-kalam text-[13px] text-brick mt-1 flex items-center gap-1", className)} {...props}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 4v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="7" cy="10.2" r="0.7" fill="currentColor" />
        </svg>
        {children}
      </p>
    );
  }
);

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  function FormActions({ children, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("flex gap-3 pt-4 justify-end", className)} {...props}>
        {children}
      </div>
    );
  }
);

Form.Field = FormField;
Form.Label = FormLabel;
Form.Description = FormDescription;
Form.Error = FormError;
Form.Actions = FormActions;
Form.Section = FormSection;
Form.Grid = FormGrid;
