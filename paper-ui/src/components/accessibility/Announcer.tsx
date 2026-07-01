import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@paper-ui/utils";

interface AnnounceContextValue {
  announce: (message: string, polite?: boolean) => void;
}

const AnnounceContext = createContext<AnnounceContextValue>({
  announce: () => {},
});

/**
 * Imperative hook to announce a message via screen readers.
 *
 * @description
 * Calls `announce(message, polite?)` to push a string into a visually hidden
 * live region. Uses a dual-region alternating pattern so identical messages
 * announced consecutively are still re-read by assistive technology.
 *
 * @param message - The text to announce.
 * @param polite - When `true` (default), uses `aria-live="polite"`. When
 *   `false`, uses `aria-live="assertive"` via `role="alert"`.
 *
 * @returns An object with the `announce` function.
 *
 * @example
 * ```tsx
 * const { announce } = useAnnouncer();
 * announce("File saved");                // polite
 * announce("Upload failed!", false);     // assertive, interrupts
 * ```
 */
export function useAnnouncer(): AnnounceContextValue {
  return useContext(AnnounceContext);
}

/**
 * Props for the {@link Announcer} component.
 */
interface AnnouncerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An optional message to announce on mount.
   */
  message?: string;
}

interface MessageSlot {
  a: string;
  b: string;
}

/**
 * Visually-masked, screen-reader-only region that alternates assigned text
 * across two `<span>` elements so repeated announcements are re-read by
 * screen readers.
 *
 * @description
 * Screen readers only re-announce live-region content when it *changes*.
 * Repeating the same string updates the DOM with identical text and may be
 * ignored. The dual-region alternating pattern toggles the message between
 * two `<span>` slots (`a` / `b`) so every call to `announce()` produces a
 * fresh DOM mutation, guaranteeing the assistive technology picks it up.
 *
 * Two ARIA regions are rendered: `role="status" aria-live="polite"` for
 * gentle updates, and `role="alert" aria-live="assertive"` for urgent
 * interruptions. Both regions are visually hidden via the `sr-only` utility.
 *
 * @example
 * ```tsx
 * <Announcer>
 *   <App />
 * </Announcer>
 * ```
 *
 * @example
 * ```tsx
 * const { announce } = useAnnouncer();
 * announce("Item deleted", false);  // assertive
 * announce("Page loaded");           // polite (default)
 * ```
 *
 * @remarks
 * Place `<Announcer>` high in the component tree (e.g. in the root layout)
 * so `useAnnouncer()` is available everywhere via context. Both regions use
 * `aria-atomic` so the entire content is read as a unit.
 */
export function Announcer({ message: initialMessage, className, children, ...rest }: AnnouncerProps) {
  const [polite, setPolite] = useState<MessageSlot>({ a: "", b: "" });
  const [assertive, setAssertive] = useState<MessageSlot>({ a: "", b: "" });
  const politeToggle = useRef(false);
  const assertiveToggle = useRef(false);

  const announce = useCallback((message: string, usePolite = true) => {
    if (usePolite) {
      politeToggle.current = !politeToggle.current;
      setPolite((prev) =>
        politeToggle.current
          ? { ...prev, a: message }
          : { ...prev, b: message },
      );
    } else {
      assertiveToggle.current = !assertiveToggle.current;
      setAssertive((prev) =>
        assertiveToggle.current
          ? { ...prev, a: message }
          : { ...prev, b: message },
      );
    }
  }, []);

  useEffect(() => {
    if (initialMessage) announce(initialMessage);
  }, [initialMessage, announce]);

  return (
    <AnnounceContext.Provider value={{ announce }}>
      <div className={cn("sr-only", className)} {...rest}>
        <div role="status" aria-live="polite" aria-atomic>
          <span>{polite.a}</span>
          <span>{polite.b}</span>
        </div>
        <div role="alert" aria-live="assertive" aria-atomic>
          <span>{assertive.a}</span>
          <span>{assertive.b}</span>
        </div>
      </div>
      {children}
    </AnnounceContext.Provider>
  );
}

Announcer.displayName = "Announcer";
