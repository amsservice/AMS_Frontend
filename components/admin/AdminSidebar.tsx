"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Database, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ADMIN_MENUS = [
  { icon: LayoutDashboard, text: "Overview", path: "/admin" },
  { icon: Database, text: "ClearDB", path: "/admin/clear-db" },
];

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const activeItem = ADMIN_MENUS
    .filter((item) => pathname === item.path || pathname.startsWith(item.path + "/"))
    .sort((a, b) => b.path.length - a.path.length)[0];

  const handleLogout = () => {
    router.replace("/admin");
  };

  const SidebarContent = () => (
    <div className="w-[290px] h-full flex flex-col bg-gradient-to-b from-black via-gray-950 to-black border-r border-white/10 shadow-2xl">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold text-white truncate">Admin</div>
          <div className="text-xs text-gray-400 truncate">System control</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {ADMIN_MENUS.map((item) => {
          const isActive = activeItem?.path === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 transition-all duration-200 transform
                ${isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:text-white hover:bg-white/10"}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left text-sm font-semibold">{item.text}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          type="button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block h-screen sticky top-0">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
