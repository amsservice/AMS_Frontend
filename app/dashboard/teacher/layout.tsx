"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function TeacherLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [themeInitialized, setThemeInitialized] = useState(false);

  /* 🔐 Role Guard */
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!user.roles.includes("teacher")) {
      router.replace(getDashboardPath(user.activeRole));
    }
  }, [loading, user, router]);

  /* 🌙 Dark Mode */
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("Upastithi-theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (savedTheme === "light") {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
        const prefersDark =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        setDarkMode(prefersDark);
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    } catch (e) {
    } finally {
      setThemeInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!themeInitialized) return;
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      window.localStorage.setItem("Upastithi-theme", darkMode ? "dark" : "light");
    } catch (e) {
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
          title="Teacher Dashboard"
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
