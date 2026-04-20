"use client";

import { useNotificationStore } from "@/src/store/useNotificationStore";
import useNotifications from "@/src/api/hooks/useNotifications";

const filters = ["All", "Unread", "Read"];

export default function NotificationsView() {
  const { notifications, loading, activeFilter, setActiveFilter, unreadCount } = useNotificationStore();
  const { handleMarkRead, handleMarkAllRead } = useNotifications();

  const unread = unreadCount();

  const filtered = notifications.filter((n) => {
    if (activeFilter === "Unread") return !n.read;
    if (activeFilter === "Read") return n.read;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center py-24 text-gray-400">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Notifications</h2>
          <p className="text-sm text-gray-500 mt-0.5">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead}
            className="text-sm text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-4 py-1.5 rounded-lg transition-all">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeFilter === f
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600"
            }`}>
            {f}
            {f === "Unread" && unread > 0 && (
              <span className="ml-1.5 bg-violet-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800/60">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            No notifications found
          </div>
        )}
        {filtered.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 px-5 py-4 group transition-colors ${!n.read ? "bg-violet-50 dark:bg-gray-900/60" : "hover:bg-gray-50 dark:hover:bg-gray-900/30"}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-violet-900/40 text-violet-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${n.read ? "text-gray-500 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
                  {n.title}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap flex-shrink-0">{n.time}</span>
              </div>
              {/* <p className="text-xs text-gray-500 mt-0.5">{n.name} · {n.email}</p> */}
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
              <div className="flex items-center gap-3 mt-2">
                {!n.read && (
                  <button onClick={() => handleMarkRead(n.id)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
