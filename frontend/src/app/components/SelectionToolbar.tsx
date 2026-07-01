import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { SelectionToolbar as PaperSelectionToolbar, type SelectionAction as PaperAction } from "@/paper-ui/components/pdf";

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

  const paperActions: PaperAction[] = actions.map(a => ({
    label: a.label,
    icon: <a.icon size={16} />,
    onClick: () => {
      if (selection) {
        a.onSelect(selection.text);
        clear();
      }
    },
  }));

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
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
        >
          <PaperSelectionToolbar actions={paperActions} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
