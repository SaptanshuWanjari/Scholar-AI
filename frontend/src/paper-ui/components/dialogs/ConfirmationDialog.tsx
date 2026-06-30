import React from "react";
import { PaperModal } from "./PaperModal";
import { PaperButton, GhostButton } from "../buttons/Buttons";

export interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  className?: string;
}

export function ConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  className,
}: ConfirmationDialogProps) {
  return (
    <PaperModal
      open={open}
      onClose={onCancel}
      title={title}
      width={400}
      className={className}
      footer={
        <>
          <GhostButton size="sm" onClick={onCancel}>
            {cancelLabel}
          </GhostButton>
          <PaperButton
            size="sm"
            tone="dark"
            onClick={onConfirm}
            border={destructive ? { stroke: "#9f3a36", fill: "#9f3a36" } : undefined}
            style={destructive ? { color: "#fbf8f2" } : undefined}
          >
            {confirmLabel}
          </PaperButton>
        </>
      }
    >
      {message && <div className="font-kalam text-[14px] text-ink">{message}</div>}
    </PaperModal>
  );
}
