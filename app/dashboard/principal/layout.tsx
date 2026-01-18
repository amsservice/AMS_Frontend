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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ams:darkMode');
      if (stored === 'true' || stored === 'false') {
        setDarkMode(stored === 'true');
        return;
      }

      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    } catch {
      // ignore
    }
  }, []);

  /* 🔐 Role Guard */
  useEffect(() => {
    if (!loading && user?.role !== "principal") {
      router.replace("/auth/school-code");
    }
  }, [loading, user, router]);

  /* 🌙 Dark Mode */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    try {
      localStorage.setItem('ams:darkMode', String(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

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

        <div className="">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
