import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SketchDivider } from "../decorations/SketchDivider";

interface CommandItemData {
  idx: number;
  label: string;
  onSelect?: () => void;
}

interface CommandContextValue {
  query: string;
  setQuery: (q: string) => void;
  cursor: number;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  loading: boolean;
  filtered: CommandItemData[];
  onEscape?: () => void;
  cursorRef: React.MutableRefObject<number>;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("Command sub-components need <Command> parent");
  return ctx;
}

function getItemLabel(child: React.ReactElement): string {
  if (child.props.label) return String(child.props.label);
  const flat = React.Children.toArray(child.props.children);
  return flat
    .filter(
      (c) =>
        typeof c === "string" ||
        typeof c === "number" ||
        (React.isValidElement(c) && !_isShortcutEl(c))
    )
    .map((c) => {
      if (typeof c === "string" || typeof c === "number") return String(c);
      if (React.isValidElement(c)) {
        const inner = React.Children.toArray(c.props.children);
        return inner.filter((cc) => typeof cc === "string").join("");
      }
      return "";
    })
    .join("")
    .trim();
}

function _isShortcutEl(el: React.ReactElement): boolean {
  return (
    (el.type as any)?.displayName === "CommandShortcut" ||
    (typeof el.type === "function" &&
      (el.type as any).name === "CommandShortcut")
  );
}

function _scan(items: CommandItemData[], nodes: React.ReactNode, counter: { i: number }) {
  React.Children.forEach(nodes, (child) => {
    if (!React.isValidElement(child)) return;
    const t = child.type as any;
    if (t?.displayName === "CommandItem" || t === CommandItemInner) {
      items.push({
        idx: counter.i++,
        label: getItemLabel(child),
        onSelect: child.props.onSelect,
      });
    } else if (t?.displayName === "CommandGroup" || t === CommandGroupInner) {
      _scan(items, child.props.children, counter);
    }
  });
}

export interface CommandProps {
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  onEscape?: () => void;
  noBorder?: boolean;
}

function CommandInner({
  children,
  className,
  loading = false,
  onEscape,
  noBorder = false,
}: CommandProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef(0);

  cursorRef.current = cursor;

  const filtered = useMemo(() => {
    const all: CommandItemData[] = [];
    _scan(all, children, { i: 0 });
    const q = query.trim().toLowerCase();
    return q
      ? all.filter((item) => item.label.toLowerCase().includes(q))
      : all;
  }, [children, query]);

  const clampedCursor = Math.max(0, Math.min(cursor, filtered.length - 1));

  useEffect(() => {
    setCursor((c) => Math.max(0, Math.min(c, filtered.length - 1)));
  }, [filtered.length]);

  const ctxValue = useMemo<CommandContextValue>(
    () => ({
      query,
      setQuery,
      cursor: clampedCursor,
      setCursor,
      inputRef,
      loading,
      filtered,
      onEscape,
      cursorRef,
    }),
    [query, clampedCursor, loading, filtered, onEscape]
  );

  return (
    <CommandContext.Provider value={ctxValue}>
      <div className={cn("relative", className)}>
        {!noBorder && (
          <SketchBorder
            fill="#fffdf9"
            stroke="#3a3733"
            strokeWidth={1.8}
            roughness={1.2}
            radius={8}
            shadow={4}
            bleed={10}
          />
        )}
        <div className="relative z-[1]">{children}</div>
      </div>
    </CommandContext.Provider>
  );
}

export interface CommandInputProps {
  placeholder?: string;
  className?: string;
}

function CommandInputInner({
  placeholder = "Type a command or search\u2026",
  className,
}: CommandInputProps) {
  const { query, setQuery, setCursor, inputRef, onEscape, filtered, cursorRef } =
    useCommand();

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[cursorRef.current];
        if (item?.onSelect) item.onSelect();
      } else if (e.key === "Escape") {
        onEscape?.();
      }
    },
    [setCursor, onEscape, filtered, cursorRef]
  );

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: "1.5px solid rgba(0,0,0,0.06)" }}
    >
      <Search size={16} className="shrink-0 text-ink-muted" aria-hidden />
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setCursor(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn(
          "flex-1 border-none bg-transparent font-architect text-[15px] text-ink placeholder:font-architect placeholder:text-ink-muted/55 focus:outline-none",
          className
        )}
        aria-label="Command search"
      />
      <kbd className="font-architect text-[11px] text-ink-muted/50">esc</kbd>
    </div>
  );
}

export interface CommandListProps {
  children?: React.ReactNode;
  className?: string;
}

function CommandListInner({ children, className }: CommandListProps) {
  const { query } = useCommand();

  let visibleIdx = 0;

  function renderChildren(nodes: React.ReactNode): React.ReactNode {
    return React.Children.map(nodes, (child) => {
      if (!React.isValidElement(child)) return child;
      const t = child.type as any;

      if (t?.displayName === "CommandGroup" || t === CommandGroupInner) {
        const groupChildren = renderChildren(child.props.children);
        const hasVisible = React.Children.toArray(groupChildren).some(
          (c) => c !== null
        );
        return hasVisible
          ? React.cloneElement(child, { children: groupChildren } as any)
          : null;
      }

      if (t?.displayName === "CommandItem" || t === CommandItemInner) {
        const itemLabel = getItemLabel(child);
        const match =
          !query.trim() ||
          itemLabel.toLowerCase().includes(query.trim().toLowerCase());
        if (!match) return null;

        const currentVisibleIdx = visibleIdx++;
        return React.cloneElement(child, {
          __cursorIdx: currentVisibleIdx,
        } as any);
      }

      return child;
    });
  }

  return (
    <div
      className={cn(
        "paper-scrollbar max-h-[320px] overflow-y-auto py-1.5",
        className
      )}
    >
      {renderChildren(children)}
    </div>
  );
}

export interface CommandGroupProps {
  heading?: string;
  children?: React.ReactNode;
}

function CommandGroupInner({ heading, children }: CommandGroupProps) {
  return (
    <div>
      {heading && (
        <div className="px-4 pt-3 pb-1.5 font-caveat text-[12px] text-ink-muted/60 tracking-wide">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

export interface CommandItemProps {
  children?: React.ReactNode;
  onSelect?: () => void;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

function CommandItemInner({
  children,
  onSelect,
  icon,
  label: _label,
  className,
  ...props
}: CommandItemProps & { __cursorIdx?: number }) {
  const { cursor, setCursor, onEscape } = useCommand();
  const cursorIdx = (props as any).__cursorIdx as number | undefined;
  const isActive = cursorIdx !== undefined && cursorIdx === cursor;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
        isActive ? "bg-black/[0.045]" : "hover:bg-black/[0.028]",
        className
      )}
      onMouseEnter={() => {
        if (cursorIdx !== undefined) setCursor(cursorIdx);
      }}
      onClick={() => {
        onSelect?.();
        onEscape?.();
      }}
    >
      {icon && <span className="shrink-0 text-ink-muted/80">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="font-architect text-[14px] text-ink">{children}</div>
      </div>
    </button>
  );
}

function CommandSeparatorInner() {
  return (
    <div className="px-3 py-1">
      <SketchDivider variant="wavy" color="#d4cfc2" strokeWidth={1.2} />
    </div>
  );
}

export interface CommandShortcutProps {
  keys: string[];
}

function CommandShortcutInner({ keys }: CommandShortcutProps) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {keys.map((k, j) => (
        <kbd
          key={j}
          className="inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1 font-architect text-[10px] text-ink-muted/60"
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.035)",
          }}
        >
          {k}
        </kbd>
      ))}
    </div>
  );
}

export interface CommandEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

function CommandEmptyInner({ children, className }: CommandEmptyProps) {
  const { filtered, query, loading } = useCommand();
  if (loading || filtered.length > 0 || query === "") return null;
  return (
    <p
      className={cn(
        "px-4 py-8 text-center font-kalam text-sm text-ink-muted/60",
        className
      )}
    >
      {children}
    </p>
  );
}

function CommandLoadingInner() {
  const { loading, query } = useCommand();
  if (!loading || query === "") return null;
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-6 font-kalam text-sm text-ink-muted/60">
      <Loader2 size={16} className="animate-spin" />
      Searching...
    </div>
  );
}

CommandItemInner.displayName = "CommandItem";
CommandGroupInner.displayName = "CommandGroup";
CommandShortcutInner.displayName = "CommandShortcut";
CommandInputInner.displayName = "CommandInput";
CommandListInner.displayName = "CommandList";
CommandSeparatorInner.displayName = "CommandSeparator";
CommandEmptyInner.displayName = "CommandEmpty";
CommandLoadingInner.displayName = "CommandLoading";

CommandInner.displayName = "Command";

export const Command = Object.assign(CommandInner, {
  Input: CommandInputInner,
  List: CommandListInner,
  Group: CommandGroupInner,
  Item: CommandItemInner,
  Separator: CommandSeparatorInner,
  Shortcut: CommandShortcutInner,
  Empty: CommandEmptyInner,
  Loading: CommandLoadingInner,
});

export { useCommand };
