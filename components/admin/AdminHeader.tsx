"use client";

import { Menu, Moon, Sun } from "lucide-react";

type Props = {
  title: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onMenuClick?: () => void;
};

export default function AdminHeader({
  title,
  darkMode,
  setDarkMode,
  onMenuClick,
}: Props) {
  const headerBg = darkMode ? "bg-black/70" : "bg-white/80";
  const borderColor = darkMode ? "border-white/10" : "border-gray-200";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <>
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 ${headerBg} backdrop-blur-md border-b ${borderColor} shadow-2xl`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onMenuClick ? (
              <button
                onClick={onMenuClick}
                className={`p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                type="button"
              >
                <Menu className={`w-5 h-5 ${textColor}`} />
              </button>
            ) : null}
            <h1 className={`text-lg font-bold ${textColor}`}>{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
              type="button"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900" />
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              A
            </div>
          </div>
        </div>
      </div>

      <div className={`hidden lg:block ${headerBg} backdrop-blur-md border-b ${borderColor} sticky top-0 z-10 shadow-2xl`}>
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className={`text-xl font-bold ${textColor}`}>{title}</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
              type="button"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900" />
              )}
            </button>

            <div className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`}>
              <div className="text-right">
                <div className={`text-sm font-semibold ${textColor}`}>Admin User</div>
                <div className={`text-xs ${subTextColor}`}>admin@system.local</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                A
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
