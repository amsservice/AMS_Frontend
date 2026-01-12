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
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Vidyarthii
              </span>
              <span className="hidden sm:block text-xs text-gray-600 dark:text-gray-400">
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
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={`${l.label}-${l.href}`}
                    href={l.href}
                    className={`text-sm font-medium transition-colors ${
                      isActiveHref(l.href)
                        ? "text-gray-900 dark:text-white font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                {hintText}
              </div>
            ) : null}

            {onToggleTheme ? (
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            ) : null}

            {showAuthButtons && (
              <>
                <Link href="/auth/login">
                  <button className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/subscription/payment?plan=1Y">
                  <button className="px-4 sm:px-6 py-2.5 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90">
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