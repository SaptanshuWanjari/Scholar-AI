import React from "react";
import { cn } from "@paper-ui/utils";
import { Spinner } from "./Spinner";

export interface LoadingOverlayRootProps {
  visible?: boolean;
  blur?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LoadingOverlayRoot = React.forwardRef<HTMLDivElement, LoadingOverlayRootProps>(
  ({ visible = true, blur = false, className, children }, ref) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center",
          blur && "backdrop-blur-sm",
          className
        )}
        style={{
          backgroundColor: "rgba(244,241,234,0.82)",
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 8px)",
        }}
      >
        {children}
      </div>
    );
  }
);
LoadingOverlayRoot.displayName = "LoadingOverlay.Root";

export interface LoadingOverlayBackdropProps {
  opacity?: number;
  className?: string;
}

function LoadingOverlayBackdrop({ opacity = 0.5, className }: LoadingOverlayBackdropProps) {
  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        backgroundColor: `rgba(244,241,234,${opacity})`,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 8px)",
      }}
      aria-hidden
    />
  );
}
LoadingOverlayBackdrop.displayName = "LoadingOverlay.Backdrop";

export interface LoadingOverlayContentProps {
  message?: string;
  spinnerVariant?: "bounce" | "spin" | "pulse" | "scribble";
  className?: string;
}

function LoadingOverlayContent({
  message,
  spinnerVariant = "bounce",
  className,
}: LoadingOverlayContentProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 z-10", className)}>
      <Spinner variant={spinnerVariant} size="md" />
      {message && <Spinner.Label>{message}</Spinner.Label>}
    </div>
  );
}
LoadingOverlayContent.displayName = "LoadingOverlay.Content";

export const LoadingOverlay = Object.assign(LoadingOverlayRoot, {
  Backdrop: LoadingOverlayBackdrop,
  Content: LoadingOverlayContent,
});
