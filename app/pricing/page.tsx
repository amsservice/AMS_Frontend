"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import PricingCards from "@/components/pricing/PricingCards";

export default function PricingPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem("vidyarthii-theme");
    const initialIsDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(initialIsDark);
    document.documentElement.classList.toggle("dark", initialIsDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("vidyarthii-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

    const includedFeatures = [
    { icon: "🎯", title: "Custom Reports", desc: "Generate reports tailored to your needs" },
    { icon: "📤", title: "Data Export", desc: "Export to CSV, Excel, PDF anytime" },
    { icon: "📊", title: "Advanced Analytics", desc: "Real-time insights and custom reports" },
    { icon: "🏫", title: "Multi-School Support", desc: "Manage multiple branches seamlessly" },
    { icon: "⚡", title: "Lightning Fast", desc: "99.9% uptime with instant sync" },
    { icon: "👥", title: "Role-Based Access", desc: "Custom permissions for every user" },
    { icon: "📧", title: "Priority Support", desc: "Email & chat support with quick response" },
    { icon: "📈", title: "Attendance Trends", desc: "Identify patterns and at-risk students" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background Blur Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl bg-violet-500/20 dark:bg-violet-500/10" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl bg-cyan-500/20 dark:bg-cyan-500/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl bg-sky-500/20 dark:bg-sky-500/10" />
        <div className="absolute -bottom-28 -right-12 h-72 w-72 rounded-full blur-3xl bg-indigo-500/20 dark:bg-indigo-500/10" />
      </div>

      <MainNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              <span className="inline-flex items-center justify-center gap-3">
                <Sparkles className="w-7 h-7 text-blue-600 dark:text-cyan-400" />
                Pick your plan. Flex the savings.
              </span>
            </h1>
            <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
              Pay per student, lock a longer plan for bigger savings, and keep your school running smooth.
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">No setup fees. Cancel anytime. Taxes may apply.</p>
          </div>

          <PricingCards isDark={isDark} />

          <div className="rounded-3xl p-8 sm:p-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Everything Included in All Plans
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                No feature restrictions. Every plan gets full access to our complete platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {includedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl transition-all duration-300 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl shrink-0">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MainFooter isDark={isDark} />
    </div>
  );
}