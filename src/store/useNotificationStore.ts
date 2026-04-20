import { create } from "zustand";

export type Notification = {
  id: number;
  type: "message";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

type NotificationStore = {
  notifications: Notification[];
  loading: boolean;
  activeFilter: string;
  setNotifications: (n: Notification[]) => void;
  setLoading: (v: boolean) => void;
  setUnreadCount: (count: number) => void;
  setActiveFilter: (v: string) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  unreadCount: () => number;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,
  activeFilter: "All",
  setNotifications: (notifications) => set({ notifications }),
  setLoading: (loading) => set({ loading }),
  setUnreadCount: (_count) => {},
  setActiveFilter: (v) => set({ activeFilter: v }),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true, status: "read" } : n
      ),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true, status: "read" })),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
