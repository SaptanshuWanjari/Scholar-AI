import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  status: "success" | "error";
  message?: string;
  timestamp: number;
}

interface NotificationState {
  notifications: AppNotification[];
  add: (n: Omit<AppNotification, "id" | "timestamp">) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: crypto.randomUUID(), timestamp: Date.now() },
        ...s.notifications,
      ],
    })),
  clearAll: () => set({ notifications: [] }),
}));
