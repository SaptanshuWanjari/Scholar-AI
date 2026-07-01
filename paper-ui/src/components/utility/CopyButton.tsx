import React, { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface CopyButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  label?: string;
  copiedLabel?: string;
  timeout?: number;
  size?: "sm" | "md";
}

const SIZES = {
  sm: "px-2.5 py-1.5 text-[13px] gap-1.5",
  md: "px-3.5 py-2 text-[15px] gap-2",
};

function CopyButtonRoot({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  timeout = 2000,
  size = "sm",
  className,
  children,
  ...props
}: CopyButtonRootProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), timeout);
    } catch {
      // ponytail: silently fail, clipboard may not be available
    }
  }, [text, timeout]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "relative inline-flex items-center rounded-md font-architect transition-colors",
        "hover:bg-[#f0efed]/60",
        SIZES[size],
        className,
      )}
      {...props}
    >
      <SketchBorder
        stroke="#bdb7a8"
        strokeWidth={1.2}
        radius={6}
        roughness={1.2}
      />
      <span className="relative z-[1] inline-flex items-center gap-1.5">
        {children ?? (
          <>
            <CopyButtonIcon copied={copied} />
            <CopyButtonLabel copied={copied} label={label} copiedLabel={copiedLabel} />
          </>
        )}
      </span>
    </button>
  );
}
CopyButtonRoot.displayName = "CopyButton.Root";

interface CopyButtonIconProps {
  copied?: boolean;
  size?: number;
  className?: string;
}

function CopyButtonIcon({ copied = false, size = 14, className }: CopyButtonIconProps) {
  const Icon = copied ? Check : Copy;
  return (
    <Icon
      size={size}
      className={cn(
        "transition-colors",
        copied ? "text-green-600" : "text-ink-muted/70",
        className,
      )}
    />
  );
}
CopyButtonIcon.displayName = "CopyButton.Icon";

interface CopyButtonLabelProps {
  copied?: boolean;
  label: string;
  copiedLabel: string;
  className?: string;
}

function CopyButtonLabel({ copied, label, copiedLabel, className }: CopyButtonLabelProps) {
  return (
    <span
      className={cn(
        "font-architect text-ink-muted/80 transition-colors",
        copied && "text-green-700",
        className,
      )}
    >
      {copied ? copiedLabel : label}
    </span>
  );
}
CopyButtonLabel.displayName = "CopyButton.Label";

interface CopyButtonToastProps {
  copied: boolean;
  className?: string;
}

function CopyButtonToast({ copied, className }: CopyButtonToastProps) {
  if (!copied) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 font-architect text-[12px] text-green-700 bg-green-50",
        "animate-in fade-in slide-in-from-left-1 duration-200",
        className,
      )}
    >
      <SketchBorder stroke="#7cb88a" strokeWidth={1} radius={5} roughness={1.2} />
      <span className="relative z-[1]">Copied!</span>
    </span>
  );
}
CopyButtonToast.displayName = "CopyButton.Toast";

export const CopyButton = Object.assign(CopyButtonRoot, {
  Icon: CopyButtonIcon,
  Label: CopyButtonLabel,
  Toast: CopyButtonToast,
});

export type { CopyButtonRootProps as CopyButtonProps };
