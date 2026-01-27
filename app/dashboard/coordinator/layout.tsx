"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function CoordinatorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [themeInitialized, setThemeInitialized] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const isAllowed = user.roles.includes("principal") || user.roles.includes("coordinator");
    if (!isAllowed) {
      router.replace(getDashboardPath(user.activeRole));
      return;
    }

    if (user.activeRole !== "coordinator") {
      router.replace(getDashboardPath(user.activeRole));
      return;
    }

    const restrictedPrefixes = [
      "/dashboard/principal/schoolProfile",
      "/dashboard/principal/session",
      "/dashboard/principal/reports",
    ];
    const isRestricted = restrictedPrefixes.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
    if (isRestricted) {
      router.replace("/dashboard/coordinator");
    }
  }, [loading, user, router, pathname]);

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
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 w-full">
        <DashboardHeader
          title="Coordinator Dashboard"
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
