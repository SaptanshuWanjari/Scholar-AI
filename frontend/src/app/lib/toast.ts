import type { ToastVariant } from "@paper-ui/components/providers";

type AddFn = (opts: { title?: string; description?: string; variant?: ToastVariant; durationMs?: number; id?: string }) => string;
type RemoveFn = (id: string) => void;

let _add: AddFn | null = null;
let _remove: RemoveFn | null = null;

export function initToast(add: AddFn, remove: RemoveFn) {
  _add = add;
  _remove = remove;
}

function show(title: string, variant: ToastVariant, description?: string) {
  if (_add) _add({ title, description, variant });
}

function showOrUpdate(title: string, variant: ToastVariant, options?: { description?: string; id?: string; action?: unknown }) {
  if (_add) {
    if (options?.id && _remove) _remove(options.id);
    _add({ title, variant, description: options?.description });
  }
}

export const toast = {
  success: (title: string, options?: { description?: string; id?: string; action?: unknown }) =>
    showOrUpdate(title, "success", options),
  error: (title: string, options?: { description?: string; id?: string; action?: unknown }) =>
    showOrUpdate(title, "error", options),
  warning: (title: string) => show(title, "warning"),
  info: (title: string, options?: { description?: string }) =>
    show(title, "default", options?.description),
  message: (title: string, options?: { description?: string }) =>
    show(title, "default", options?.description),
  loading: (title: string): string => {
    if (_add) return _add({ title, variant: "default", durationMs: 0 });
    return "";
  },
};
