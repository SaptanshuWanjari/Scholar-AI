import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LogLevel = "error" | "critical";

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  details?: string;
}

interface LogStore {
  logs: LogEntry[];
  addLog: (level: LogLevel, message: string, details?: string) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogStore>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (level, message, details) =>
        set((state) => {
          const newLog: LogEntry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            level,
            message,
            details,
          };
          return { logs: [newLog, ...state.logs].slice(0, 100) }; // Keep last 100 logs
        }),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "scholar-logs",
      version: 1,
      merge: (persistedState: unknown, currentState: LogStore) => {
        // Validation: ensure persistedState is an object and has logs array
        if (
          persistedState &&
          typeof persistedState === "object" &&
          "logs" in persistedState &&
          Array.isArray((persistedState as any).logs)
        ) {
          const validLogs = ((persistedState as any).logs as unknown[]).filter((log: any) => {
            return (
              log &&
              typeof log === "object" &&
              typeof log.id === "string" &&
              typeof log.timestamp === "number" &&
              (log.level === "error" || log.level === "critical") &&
              typeof log.message === "string"
            );
          });
          return { ...currentState, logs: validLogs as LogEntry[] };
        }
        return currentState; // Fallback to current (default) state if malformed
      }
    }
  )
);
