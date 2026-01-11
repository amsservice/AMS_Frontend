"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Moon, Sun, Sparkles } from "lucide-react";

type MainNavbarProps = {
  isDark: boolean;
  onToggleTheme?: () => void;
  showAuthButtons?: boolean;
  showLandingLinks?: boolean;
  navLinks?: Array<{ label: string; href: string }>;
  hintText?: string;
};

export default function MainNavbar({
  isDark,
  onToggleTheme,
  showAuthButtons = true,
  showLandingLinks = false,
  navLinks,
  hintText,
}: MainNavbarProps) {
  const pathname = usePathname();

  const resolvedLinks =
    navLinks ??
    (showLandingLinks
      ? ([
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ] as Array<{ label: string; href: string }>)
      : null);

  const isActiveHref = (href: string) => {
    if (!href.startsWith("/")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDark ? "bg-gray-950/70 border-white/10" : "bg-white/70 border-gray-200/70"
      } backdrop-blur-xl border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ring-1 ${
                isDark
                  ? "bg-linear-to-br from-indigo-400/25 via-sky-400/20 to-cyan-300/20 ring-white/10"
                  : "bg-linear-to-br from-indigo-600 via-sky-600 to-cyan-500 ring-black/5"
              }`}
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className={`text-lg font-semibold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                Vidyarthii
              </span>
              <span className={`hidden sm:block text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                School management, simplified
              </span>
            </div>
          </Link>

          {resolvedLinks ? (
            <div className="hidden md:flex items-center gap-8">
              {resolvedLinks.map((l) =>
                l.href.startsWith("#") ? (
                  <a
                    key={`${l.label}-${l.href}`}
                    href={l.href}
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    } transition-colors`}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={`${l.label}-${l.href}`}
                    href={l.href}
                    className={`text-sm font-medium transition-colors ${
                      isActiveHref(l.href)
                        ? isDark
                          ? "text-white"
                          : "text-gray-900"
                        : isDark
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
          ) : null}

          <div className="flex items-center gap-4">
            {hintText ? (
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-300" />
                {hintText}
              </div>
            ) : null}

            {onToggleTheme ? (
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 ring-1 ring-white/10 focus:ring-offset-gray-950"
                    : "bg-gray-100 hover:bg-gray-200 ring-1 ring-gray-200 focus:ring-offset-white"
                }`}
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            ) : null}

            {showAuthButtons && (
              <>
                <Link href="/auth/login">
                  <button
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 ${
                      isDark
                        ? "text-gray-300 hover:text-white focus:ring-offset-gray-950"
                        : "text-gray-600 hover:text-gray-900 focus:ring-offset-white"
                    }`}
                  >
                    Login
                  </button>
                </Link>
                <Link href="/subscription/payment?plan=1Y">
                  <button
                    className={`px-4 sm:px-6 py-2.5 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 ${
                      isDark
                        ? "bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-500 shadow-sky-500/25 focus:ring-offset-gray-950"
                        : "bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 shadow-sky-500/30 focus:ring-offset-white"
                    }`}
                  >
                    Register School
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
