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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            )}
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
              )}
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
              )}
            </button>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}