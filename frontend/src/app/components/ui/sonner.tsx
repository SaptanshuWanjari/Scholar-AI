"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "paper-texture !border-[#c8c0b0] !shadow-[2px_3px_0_rgba(0,0,0,0.12)] font-architect text-sm",
          title: "font-architect text-sm text-[#262320]",
          description: "font-kalam text-xs text-[#3a3733]",
          icon: "shrink-0 mt-0.5",
          actionButton: "font-architect text-xs text-[#262320] underline",
          cancelButton: "font-architect text-xs text-[#3a3733]",
          closeButton:
            "absolute top-1.5 right-1.5 size-5 flex items-center justify-center rounded-full text-[#3a3733] hover:text-[#262320]",
        },
      }}
      style={
        {
          "--normal-bg": "#fffdf9",
          "--normal-border": "#c8c0b0",
          "--normal-text": "#262320",
          "--success-bg": "#dcf0d8",
          "--success-border": "#a8c8a0",
          "--success-text": "#2f5d3a",
          "--error-bg": "#fce4e4",
          "--error-border": "#d4a0a0",
          "--error-text": "#8a3030",
          "--warning-bg": "#fde9c9",
          "--warning-border": "#d4b888",
          "--warning-text": "#7a5a20",
          "--info-bg": "#ddeeff",
          "--info-border": "#a0b8d4",
          "--info-text": "#2a4a6a",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
