"use client";

import {
  GraduationCap,
  ChevronRight,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { DASHBOARD_MENUS } from "@/lib/dashboardMenus";
import { useMySchool } from '@/app/querry/useSchool';


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({ isOpen, onClose }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useMySchool();

  const role = user?.role || "student";
  const menus = DASHBOARD_MENUS[role];
  const schoolName = data?.school?.name;
  
  const activeItem = menus
    .filter(item =>
      pathname === item.path ||
      pathname.startsWith(item.path + "/")
    )
    .sort((a, b) => b.path.length - a.path.length)[0];

  const SidebarContent = () => (
    <div className="w-[280px] h-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Vidyarthii</span>
      </div>

      {/* School Info Card */}
      <div className="mx-4 my-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
            {schoolName?.charAt(0) || "S"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {schoolName || "School"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {menus.map(item => {
          const isActive = activeItem?.path === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1.5 transition-all duration-200 transform
                ${isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left text-sm font-medium">
                {item.text}
              </span>
              {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={() => {
            logout();
            router.replace("/auth/login");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}