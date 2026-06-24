import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoSave<T>(
  saveFn: (data: T) => Promise<void>,
  delay = 2000,
): { schedule: (data: T) => void; flush: () => void; saving: boolean; lastSaved: string } {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  const schedule = useCallback(
    (data: T) => {
      pendingRef.current = data;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await saveFn(data);
          setLastSaved("just now");
        } finally {
          setSaving(false);
        }
      }, delay);
    },
    [saveFn, delay],
  );

  const flush = useCallback(() => {
    if (timerRef.current && pendingRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      saveFn(pendingRef.current).catch(() => {});
      pendingRef.current = null;
    }
  }, [saveFn]);

  useEffect(() => {
    return () => {
      flush();
    };
  }, [flush]);

  return { schedule, flush, saving, lastSaved };
}
