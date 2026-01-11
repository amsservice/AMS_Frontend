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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative isolate min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-linear-to-b from-slate-950 via-slate-950 to-slate-900"
          : "bg-linear-to-b from-white via-slate-50 to-slate-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl ${isDark ? "bg-violet-500/8" : "bg-violet-500/14"}`} />
        <div className={`absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl ${isDark ? "bg-cyan-500/10" : "bg-cyan-500/16"}`} />
        <div className={`absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl ${isDark ? "bg-sky-500/10" : "bg-sky-500/14"}`} />
        <div className={`absolute -bottom-28 -right-12 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-indigo-500/10" : "bg-indigo-500/12"}`} />
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

      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              <span className="inline-flex items-center justify-center gap-3">
                <Sparkles className={`w-7 h-7 ${isDark ? "text-cyan-300" : "text-indigo-600"}`} />
                Pick your plan. Flex the savings.
              </span>
            </h1>
            <p className={`text-base sm:text-lg max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Pay per student, lock a longer plan for bigger savings, and keep your school running smooth.
            </p>
            <p className="mt-3 text-sm text-gray-500">No setup fees. Cancel anytime. Taxes may apply.</p>
          </div>

          <PricingCards isDark={isDark} />

          <section className="mt-8">
            <div
              className={`rounded-3xl p-8 sm:p-12 relative overflow-hidden ring-1 ${
                isDark
                  ? "bg-linear-to-br from-slate-900/50 to-slate-800/50 ring-white/10"
                  : "bg-linear-to-br from-white to-gray-50 ring-gray-200 shadow-xl"
              }`}
            >
              <div className="pointer-events-none absolute inset-0">
                <div className={`absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl ${isDark ? "bg-cyan-500/10" : "bg-cyan-500/12"}`} />
                <div className={`absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl ${isDark ? "bg-violet-500/10" : "bg-violet-500/10"}`} />
              </div>

              <div className="relative">
                <div className="text-center mb-10">
                  <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Everything you need to run attendance — without the busy work.
                  </h2>
                  <p className={`text-base sm:text-lg max-w-3xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Every plan includes the full platform. No feature locks — just smoother operations, cleaner records, and faster follow-ups.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Attendance that takes seconds",
                      desc: "Mark daily attendance quickly with a layout teachers actually enjoy using. Less clicking, fewer mistakes.",
                    },
                    {
                      title: "Clear dashboards for every role",
                      desc: "Principals get high-level clarity, teachers get daily flow, and students stay informed — all from the same system.",
                    },
                    {
                      title: "Reports that feel instant",
                      desc: "Generate attendance summaries and class insights whenever you need them — perfect for reviews and follow-ups.",
                    },
                    {
                      title: "Reliable data, always backed up",
                      desc: "Your attendance records stay consistent and protected, so you never have to rebuild history.",
                    },
                    {
                      title: "Designed for growing schools",
                      desc: "Add students over time and keep everything organized. Your workflow stays simple even as the numbers grow.",
                    },
                    {
                      title: "Support that helps, not redirects",
                      desc: "If you get stuck, we help you move forward. Quick answers, clear guidance, and practical fixes.",
                    },
                  ].map((f, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl p-6 transition-all duration-300 ring-1 ${
                        isDark
                          ? "bg-white/5 ring-white/10 hover:bg-white/7"
                          : "bg-white ring-gray-200 hover:shadow-lg"
                      }`}
                    >
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{f.title}</h3>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>{f.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Want a clean start? Choose a plan, set your student count, and you’re ready to go.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <MainFooter isDark={isDark} />
    </div>
  );
}
