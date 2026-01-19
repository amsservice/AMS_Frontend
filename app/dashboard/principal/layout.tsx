"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import DashboardSidebar from "@/components/navbar/DashboardSidebar";
import DashboardHeader from "@/components/navbar/DashboardHeader";

export default function PrincipalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [themeInitialized, setThemeInitialized] = useState(false);

  /* 🔐 Role Guard (Incoming Functionality) */
  useEffect(() => {
    if (!loading && user?.role !== "principal") {
      router.replace("/auth/school-code");
    }
  }, [loading, user, router]);

  /* 🌙 Upastithi Theme Logic (Your local key & logic) */
  useEffect(() => {
    try {
      // 1. On mount, check LocalStorage using Upastithi key
      const savedTheme = window.localStorage.getItem("Upastithi-theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (savedTheme === "light") {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
        // 2. If no setting, check system preference (Incoming window check)
        const prefersDark = 
          typeof window !== 'undefined' && 
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        setDarkMode(prefersDark);
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    } catch (e) {
      // ignore (Incoming safety functionality)
    } finally {
      setThemeInitialized(true);
    }
  }, []);

  /* 3. Watch for manual toggles (Upastithi Logic with Incoming safety) */
  useEffect(() => {
    if (!themeInitialized) return;
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      window.localStorage.setItem("Upastithi-theme", darkMode ? "dark" : "light");
    } catch (e) {
      // ignore
    }
  }, [darkMode, themeInitialized]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen dashboard-bg">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 w-full">
        <DashboardHeader
          title="Principal Dashboard"
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Keeping your specific UI padding classes */}
        <div className="">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}