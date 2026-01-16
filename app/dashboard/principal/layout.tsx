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

  /* 🔐 Role Guard */
  useEffect(() => {
    if (!loading && user?.role !== "principal") {
      router.replace("/auth/school-code");
    }
  }, [loading, user, router]);

  /* 🌙 Dark Mode */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
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

        <div className="p-4 pt-20 lg:pt-0 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
