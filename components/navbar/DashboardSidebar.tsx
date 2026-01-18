"use client";

import { GraduationCap, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";
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
    .filter(item => pathname === item.path || pathname.startsWith(item.path + "/"))
    .sort((a, b) => b.path.length - a.path.length)[0];

  const SidebarContent = () => (
    <div className="w-[280px] h-full flex flex-col bg-[#0B0F1A] border-r border-white/5 shadow-2xl relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
      
      {/* Logo Section */}
      <div className="relative px-8 py-8 flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: -10 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
        >
          <GraduationCap className="w-6 h-6 text-white" />
        </motion.div>
        <span className="text-xl font-extrabold tracking-tight text-white italic">
          Upastithi<span className="text-blue-500">.</span>
        </span>
      </div>

      {/* School Info Card - Glassmorphism */}
      <div className="relative mx-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-blue-400 font-bold border border-white/10 group-hover:scale-110 transition-transform">
              {schoolName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">School</p>
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {schoolName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menus.map((item) => {
          const isActive = activeItem?.path === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              className="relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl group transition-all"
            >
              {/* Animated Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 rounded-xl shadow-lg shadow-blue-900/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
              </div>
              
              <span className={`relative z-10 flex-1 text-left text-sm font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                {item.text}
              </span>

              {isActive && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Logout Section */}
      <div className="relative p-4 mt-auto">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <motion.button
          whileHover={{ x: 5 }}
          onClick={() => {
            logout();
            router.replace("/auth/school-code");
          }}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-gray-400 hover:text-red-400 transition-colors group"
        >
          <div className="p-2 rounded-lg group-hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Sign Out</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}