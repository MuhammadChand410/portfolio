"use client";

import { usePathname } from "next/navigation";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";
import ThemeToggle from "./ThemeToggle";
import { useUserStore } from "@/src/store/useUserStore";
import useAuth from "@/src/api/hooks/useAuth";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/services": "Services",
  "/admin/projects": "Projects",
  "/admin/testimonials": "Testimonials",
  "/admin/contact-queries": "Contact Queries",
  "/admin/notifications": "Notifications",
  "/admin/roles": "Roles Management",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const { logoutUser } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-xs text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationsDropdown />
        <ProfileDropdown logout={logoutUser} user={user} clearUser={clearUser} />
      </div>
    </header>
  );
}
