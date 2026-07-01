import React, { useState, useCallback } from "react";
import { Copy, FileCode, Link2, FileText } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

type ContentType = "text" | "code" | "link";

export interface ClipboardButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
  contentType?: ContentType;
  label?: string;
  preview?: boolean;
  timeout?: number;
}

const TYPE_ICONS: Record<ContentType, React.ElementType> = {
  text: FileText,
  code: FileCode,
  link: Link2,
};

const TYPE_LABELS: Record<ContentType, string> = {
  text: "Text",
  code: "Code",
  link: "Link",
};

function ClipboardButtonRoot({
  content,
  contentType = "text",
  label,
  preview = false,
  timeout = 2000,
  className,
  children,
  ...props
}: ClipboardButtonRootProps) {
  const [copied, setCopied] = useState(false);
  const TypeIcon = TYPE_ICONS[contentType];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {
      // ponytail: silently fail
    }
  }, [content, timeout]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-architect text-[14px]",
        "hover:bg-[#f0efed]/50 transition-colors text-ink-muted",
        className,
      )}
      {...props}
    >
      <SketchBorder stroke="#bdb7a8" strokeWidth={1.2} radius={6} roughness={1.2} />
      <span className="relative z-[1] inline-flex items-center gap-2 w-full">
        {children ?? (
          <>
            <ClipboardButtonIcon
              copied={copied}
              contentType={contentType}
            />
            {preview && <ClipboardButtonPreview content={content} contentType={contentType} />}
            <span className="flex-1 text-left truncate max-w-[140px]">
              {label ?? `${TYPE_LABELS[contentType]}: ${content.slice(0, 24)}${content.length > 24 ? "…" : ""}`}
            </span>
            <span
              className={cn(
                "ml-auto shrink-0 text-[11px] font-medium transition-colors",
                copied ? "text-green-600" : "text-ink-muted/50",
              )}
            >
              {copied ? "Copied" : "Copy"}
            </span>
            <TypeIcon size={14} className="shrink-0 text-ink-muted/40" />
          </>
        )}
      </span>
    </button>
  );
}
ClipboardButtonRoot.displayName = "ClipboardButton.Root";

interface ClipboardButtonIconProps {
  copied?: boolean;
  contentType?: ContentType;
  size?: number;
  className?: string;
}

function ClipboardButtonIcon({
  copied = false,
  contentType = "text",
  size = 15,
  className,
}: ClipboardButtonIconProps) {
  const Icon = copied ? Copy : TYPE_ICONS[contentType];
  return (
    <Icon
      size={size}
      className={cn(
        "shrink-0 transition-colors",
        copied ? "text-green-600" : "text-ink-muted/50",
        className,
      )}
    />
  );
}
ClipboardButtonIcon.displayName = "ClipboardButton.Icon";

interface ClipboardButtonPreviewProps {
  content: string;
  contentType?: ContentType;
  maxLength?: number;
  className?: string;
}

function ClipboardButtonPreview({
  content,
  contentType = "text",
  maxLength = 40,
  className,
}: ClipboardButtonPreviewProps) {
  const truncated = content.length > maxLength
    ? content.slice(0, maxLength) + "…"
    : content;

  return (
    <span
      className={cn(
        "relative shrink-0 rounded px-2 py-0.5 font-mono text-[11px] max-w-[160px] truncate bg-[#f0efed]/80",
        contentType === "code" && "bg-[#f4f1ea]",
        contentType === "link" && "text-blue-600 underline",
        className,
      )}
    >
      <SketchBorder stroke="#d4cfc4" strokeWidth={0.8} radius={4} roughness={1} />
      <span className="relative z-[1]">{truncated}</span>
    </span>
  );
}
ClipboardButtonPreview.displayName = "ClipboardButton.Preview";

export const ClipboardButton = Object.assign(ClipboardButtonRoot, {
  Icon: ClipboardButtonIcon,
  Preview: ClipboardButtonPreview,
});

export type { ClipboardButtonRootProps as ClipboardButtonProps };
