import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperCard } from "@paper-ui/core";
import { MarkerHighlight } from "@paper-ui/core";
import { Tape } from "@paper-ui/components/decorations";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "paper" | "sticky";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card({ children, variant = "paper", className, ...props }, ref) {
    const isSticky = variant === "sticky";
    return (
      <PaperCard
        ref={ref}
        className={cn("p-5", isSticky && "paper-texture-without-svg", className)}
        surface={isSticky ? "#fdf3b8" : "#fffdf9"}
        shadow={isSticky ? "sm" : "md"}
        rotate={isSticky ? -0.8 : undefined}
        texture={!isSticky}
        border={isSticky ? null : undefined}
        {...props}
      >
        {!isSticky && <Tape corner="top-left" />}
        {children}
      </PaperCard>
    );
  },
);

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = React.forwardRef<HTMLDivElement, DivProps>(
  function CardHeader({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("pb-3 border-b border-dashed border-ink/10", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  marker?: boolean;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ children, marker, className, ...props }, ref) {
    const el = (
      <h3
        ref={ref}
        className={cn("font-caveat text-[24px] font-bold text-ink", className)}
        {...props}
      >
        {children}
      </h3>
    );
    return marker ? <MarkerHighlight>{el}</MarkerHighlight> : el;
  },
);

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ children, className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn("font-kalam text-[14px] text-ink-muted/80 leading-relaxed", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);

export const CardContent = React.forwardRef<HTMLDivElement, DivProps>(
  function CardContent({ children, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("py-4", className)} {...props}>
        {children}
      </div>
    );
  },
);

export const CardFooter = React.forwardRef<HTMLDivElement, DivProps>(
  function CardFooter({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("pt-3 border-t border-dashed border-ink/10 flex gap-2 items-center", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const CardMedia = React.forwardRef<HTMLImageElement, CardMediaProps>(
  function CardMedia({ className, src, alt, ...props }, ref) {
    return (
      <div className={cn("rounded-[4px] overflow-hidden mb-4", className)}>
        <img ref={ref} src={src} alt={alt} className="w-full h-auto block" {...props} />
      </div>
    );
  },
);

export const CardActions = React.forwardRef<HTMLDivElement, DivProps>(
  function CardActions({ children, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("flex gap-2 pt-2", className)} {...props}>
        {children}
      </div>
    );
  },
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Media = CardMedia;
Card.Actions = CardActions;
