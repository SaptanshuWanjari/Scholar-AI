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
  unread: boolean;
  add: (n: Omit<AppNotification, "id" | "timestamp">) => void;
  markRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unread: false,
  add: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: crypto.randomUUID(), timestamp: Date.now() },
        ...s.notifications,
      ],
      unread: true,
    })),
  markRead: () => set({ unread: false }),
  clearAll: () => set({ notifications: [], unread: false }),
}));
