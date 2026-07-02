"use client";

import { useEffect } from "react";
import { ToastProvider, useToast } from "@paper-ui/components/providers";
import type { FC } from "react";
import { initToast } from "@/app/lib/toast";

const ToastBridge: FC = () => {
  const { addToast, removeToast } = useToast();
  useEffect(() => {
    initToast(addToast, removeToast);
  }, [addToast, removeToast]);
  return null;
};

const Toaster = () => {
  return (
    <ToastProvider defaultDurationMs={5000}>
      <ToastBridge />
      <ToastProvider.Viewport position="bottom-right" />
    </ToastProvider>
  );
};

export { Toaster };
