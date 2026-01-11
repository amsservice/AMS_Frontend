"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type DashboardHeaderProps = {
  title: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onMenuClick?: () => void; // mobile sidebar
};

export default function DashboardHeader({
  title,
  darkMode,
  setDarkMode,
  onMenuClick
}: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 dashboard-header-bg border-b dashboard-card-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Menu className="w-5 h-5 dashboard-text" />
              </button>
            )}
            <h1 className="text-lg font-bold dashboard-text">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 dashboard-text" />
              ) : (
                <Moon className="w-5 h-5 dashboard-text" />
              )}
            </button>

            <div className="w-9 h-9 rounded-full accent-blue flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden lg:block dashboard-header-bg border-b dashboard-card-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold dashboard-text">{title}</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 dashboard-text" />
              ) : (
                <Moon className="w-5 h-5 dashboard-text" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold dashboard-text">
                  {user?.name}
                </div>
                <div className="text-xs dashboard-text-muted">
                  {user?.email}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full accent-blue flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
