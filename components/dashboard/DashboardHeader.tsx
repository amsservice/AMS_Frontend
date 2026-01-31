"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Moon,
  Sun,
  Search,
  Bell,
  PlusCircle,
  Users,
  BookOpen,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type DashboardHeaderProps = {
  title: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onMenuClick?: () => void;
};

export default function DashboardHeader({
  title,
  darkMode,
  setDarkMode,
  onMenuClick,
}: DashboardHeaderProps) {
  const { user, switchRole } = useAuth();
  const router = useRouter();

  // --- UI States ---
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // --- Click Outside Logic ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node))
        setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node))
        setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quickActions = [
    {
      icon: PlusCircle,
      label: "Add Session",
      href: "/dashboard/sessions",
      desc: "Manage academic years",
    },
    {
      icon: Users,
      label: "Add Student",
      href: "/dashboard/students",
      desc: "Enroll new students",
    },
    {
      icon: BookOpen,
      label: "View Plans",
      href: "/dashboard/plans",
      desc: "Subscription details",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
      desc: "Account preferences",
    },
  ];

  const testNotifications = [
    {
      id: 1,
      title: "Fee Reminder",
      body: "Monthly fee collection starts tomorrow.",
      time: "5m ago",
      type: "urgent",
    },
    {
      id: 2,
      title: "System Update",
      body: "New attendance features are now live.",
      time: "2h ago",
      type: "info",
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200/60 dark:border-white/5 bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* LEFT: Title */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        {/* MIDDLE: Search (Physically Connected) */}
        <div
          className="hidden md:flex flex-1 max-w-md mx-8 relative"
          ref={searchRef}
        >
          <div className="relative w-full z-50">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                showSearch ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              onFocus={() => setShowSearch(true)}
              placeholder="Search features..."
              className={`w-full bg-gray-100 dark:bg-white/5 border border-transparent py-2 pl-10 pr-4 text-sm outline-none transition-all duration-300 cursor-text ${
                showSearch
                  ? "rounded-t-2xl bg-white dark:bg-[#131926] border-gray-200 dark:border-white/10 shadow-sm"
                  : "rounded-2xl"
              }`}
            />

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ originY: 0 }}
                  className="absolute top-full left-0 w-full bg-white dark:bg-[#131926] border-x border-b border-gray-200 dark:border-white/10 rounded-b-2xl shadow-2xl overflow-hidden z-40"
                >
                  <div className="p-2 border-t border-gray-100 dark:border-white/5">
                    {quickActions && quickActions.length > 0 ? (
                      <div className="grid gap-1">
                        {quickActions.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => {
                              router.push(action.href);
                              setShowSearch(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group text-left cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <action.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {action.label}
                              </p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                {action.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-3 py-4 text-xs text-gray-400 text-center">
                        Type to search across Upastithi...
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 lg:gap-5">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2.5 transition-all z-50 cursor-pointer ${
                showNotifications
                  ? "bg-white dark:bg-[#131926] rounded-t-xl text-blue-500 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
                  : "rounded-xl text-gray-500 bg-gray-100 border-gray-200 border-[1px] hover:bg-gray-100 dark:bg-white/5 dark:border-white/10"
              }`}
            >
              <Bell className="w-5 h-5" />
              {!showNotifications && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0B0F1A]"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ originY: 0 }}
                  className="absolute right-0 top-full w-80 bg-white dark:bg-[#131926] border-x border-b border-gray-200 dark:border-white/10 rounded-b-2xl rounded-tl-2xl shadow-2xl z-40 overflow-hidden"
                >
                  <div className="p-4 h-10 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/30 dark:bg-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Activity
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">
                      New
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {testNotifications.map((n) => (
                      <div
                        key={n.id}
                        className="group p-4 border-b border-gray-50 dark:border-white/5 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-semibold dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {n.body}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-2 font-medium uppercase tracking-tighter">
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 text-[10px] font-bold text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest cursor-pointer">
                    View All Activity
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all group cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div
                  key="s"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="m"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5 text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((v) => !v)}
              className="flex items-center gap-3 pl-2 group cursor-pointer"
            >
              <div className="hidden text-right lg:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-500 transition-colors">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  {user?.email || "user@email.com"}
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-xl bg-white dark:bg-[#0B0F1A] flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#131926] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-40 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100 dark:border-white/5">
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {user?.email || "user@email.com"}
                    </p>
                  </div>

                  <div className="p-2">
                    {user?.roles?.includes("teacher") && user?.activeRole !== "teacher" && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          switchRole("teacher");
                        }}
                        className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              Switch to Teacher Dashboard
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              Teacher view & tools
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    {user?.roles?.includes("coordinator") && user?.activeRole !== "coordinator" && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          switchRole("coordinator");
                        }}
                        className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              Switch to Coordinator Dashboard
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              Coordinator view & tools
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (user?.activeRole === "teacher") {
                          router.push("/dashboard/teacher/teacher-profile");
                          return;
                        }

                        router.push("/dashboard/settings");
                      }}
                      className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            My Profile
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Account & preferences
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}