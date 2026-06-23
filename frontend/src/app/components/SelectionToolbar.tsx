import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

export interface SelectionAction {
  label: string;
  icon: LucideIcon;
  onSelect: (text: string) => void;
}

interface SelectionState {
  text: string;
  x: number;
  y: number;
}

export function useTextSelection(containerRef: RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<SelectionState | null>(null);

  const clear = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    const handle = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      const anchor = sel.anchorNode;
      if (!text || text.length < 2 || !anchor) {
        setSelection(null);
        return;
      }
      if (containerRef.current && !containerRef.current.contains(anchor)) {
        setSelection(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    };
    document.addEventListener("mouseup", handle);
    document.addEventListener("keyup", handle);
    return () => {
      document.removeEventListener("mouseup", handle);
      document.removeEventListener("keyup", handle);
    };
  }, [containerRef]);

  return { selection, clear };
}

export function SelectionToolbar({
  containerRef,
  actions,
}: {
  containerRef: RefObject<HTMLElement | null>;
  actions: SelectionAction[];
}) {
  const { selection, clear } = useTextSelection(containerRef);
  const barRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.14 }}
          style={{
            position: "fixed",
            left: selection.x,
            top: selection.y - 12,
            transform: "translate(-50%, -100%)",
            zIndex: 60,
          }}
          className="flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg shadow-foreground/5"
        >
          {actions.map((a, i) => (
            <button
              key={a.label}
              onClick={() => {
                a.onSelect(selection.text);
                clear();
              }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              style={{ borderLeft: i > 0 ? "1px solid var(--border)" : undefined }}
            >
              <a.icon className="size-3.5 text-violet" />
              {a.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
