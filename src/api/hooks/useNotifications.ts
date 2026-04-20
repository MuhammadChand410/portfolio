import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from "../services/notification";

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

function normalize(n: any) {
  return {
    id: n.id,
    type: "message" as const,
    title: n.title ?? n.subject ?? "Notification",
    desc: n.message ?? n.description ?? n.body ?? "",
    time: timeAgo(n.created_at),
    read: n.is_read ?? n.read ?? n.status === "read" ?? false,
    name: n.name ?? n.sender ?? "",
    email: n.email ?? "",
    subject: n.title ?? n.subject ?? "",
    message: n.message ?? n.description ?? n.body ?? "",
    status: (n.is_read ?? n.read ?? n.status === "read") ? "read" : "unread",
    created_at: n.created_at,
  };
}

export default function useNotifications() {
  const {
    setNotifications,
    setLoading,
    setUnreadCount,
    markRead: markReadLocal,
    markAllRead: markAllLocal,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      const raw = Array.isArray(data) ? data : data.results ?? [];
      setNotifications(raw.map(normalize));
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      // backend may return { count: 5 } or { unread_count: 5 } or just a number
      const count = typeof data === "number" ? data : data.count ?? data.unread_count ?? 0;
      setUnreadCount(count);
    } catch {
      // silent
    }
  };

  const handleMarkRead = async (id: number) => {
    markReadLocal(id);
    try {
      await markNotificationRead(id);
      fetchUnreadCount();
    } catch {
      // optimistic update already applied
    }
  };

  const handleMarkAllRead = async () => {
    markAllLocal();
    try {
      await markAllNotificationsRead();
      fetchUnreadCount();
    } catch {
      // optimistic update already applied
    }
  };

  return { fetchNotifications, fetchUnreadCount, handleMarkRead, handleMarkAllRead };
}
