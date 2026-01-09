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
    <div className="w-[280px] h-full flex flex-col nav-bg">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)] flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Vidyarthii</span>
      </div>

      {/* User Card */}
      {/* <div className="mx-4 mb-6 p-4 rounded-xl nav-bg-lighter nav-border border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {user?.name}
            </div>
            <div className="text-xs nav-text capitalize">
              {role}
            </div>
          </div>
        </div>
      </div> */}
      <div className="mx-4 mb-6 p-4 rounded-xl nav-bg-lighter nav-border border">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white font-semibold">
      {schoolName?.charAt(0) || "S"}
    </div>
    <div className="min-w-0">
      <div className="text-sm font-semibold text-white truncate">
        {schoolName || "School"}
      </div>
      
    </div>
  </div>
</div>

      <nav className="flex-1 px-3">
  {menus.map(item => {
    const isActive = activeItem?.path === item.path;

    return (
      <button
        key={item.path}
        onClick={() => {
          router.push(item.path);
          onClose();
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all
          ${isActive
            ? "nav-active-bg nav-active-text"
            : "nav-text hover:nav-text-hover hover:bg-[var(--nav-bg-lighter)]"
          }`}
      >
        <item.icon className="w-5 h-5" />
        <span className="flex-1 text-left text-sm font-medium">
          {item.text}
        </span>
        {isActive && <ChevronRight className="w-4 h-4" />}
      </button>
    );
  })}
</nav>


      {/* Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            logout();
            router.replace("/auth/login");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg nav-text hover:nav-text-hover hover:bg-[var(--nav-bg-lighter)]"
        >
          <LogOut className="w-5 h-5" />
          Logout
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
