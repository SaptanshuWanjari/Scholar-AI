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
    }
  )
);
