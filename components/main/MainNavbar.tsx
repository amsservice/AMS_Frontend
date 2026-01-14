"use client";

import { useState } from "react";
import { Calendar, Moon, Sun, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:shadow-xl transition-shadow"
              >
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>

              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Upasthiti
                </span>
                <span className="hidden sm:block text-xs text-gray-600 dark:text-gray-400">
                  School management, simplified
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex justify-center flex-1">
            {resolvedLinks && (
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                {resolvedLinks.map((l) => (
                  <motion.div key={`${l.label}-${l.href}`} className="relative">
                    {l.href.startsWith("#") ? (
                      <a
                        href={l.href}
                        className="relative px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <a
                        href={l.href}
                        className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-colors ${
                          isActiveHref(l.href)
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {l.label}
                        {isActiveHref(l.href) && (
                          <motion.div
                            layoutId="activeTab"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0 }}
                            style={{ transformOrigin: "left" }}
                            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                              mass: 0.5,
                            }}
                          />
                        )}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center justify-end flex-1 gap-2 sm:gap-4 min-h-[40px]">
            {/* Hint Text */}
            {hintText && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                {hintText}
              </motion.div>
            )}

            {/* Theme Toggle */}
            {onToggleTheme && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="relative p-2 rounded-xl transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 overflow-hidden"
              >
                <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                  <AnimatePresence initial={false}>
                    {isDark ? (
                      <motion.div
                        key="sun"
                        className="absolute"
                        initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      >
                        <Sun className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        className="absolute"
                        initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      >
                        <Moon className="w-5 h-5 text-gray-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            )}

            {/* Auth Buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-2 min-w-[200px] justify-end">
            {showAuthButtons && (
              <div className="hidden sm:flex items-center gap-2">
                <a href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Login
                  </motion.button>
                </a>
                <a href="/auth/register">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 lg:px-6 py-2.5 text-white rounded-xl font-semibold text-sm transition-all shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90"
                  >
                    Register School
                  </motion.button>
                </a>
              </div>
            )}
            </div>

            {/* Mobile Menu Button */}
            {(resolvedLinks || showAuthButtons) && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Nav Links */}
              {resolvedLinks?.map((l, idx) => (
                <motion.div
                  key={`${l.label}-${l.href}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {l.href.startsWith("#") ? (
                    <a
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <a
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        isActiveHref(l.href)
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-gray-900 dark:text-white border-l-4 border-blue-600"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {l.label}
                    </a>
                  )}
                </motion.div>
              ))}

              {/* Mobile Auth Buttons */}
              {showAuthButtons && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-3 space-y-2 border-t border-gray-200 dark:border-gray-700"
                >
                  <a href="/auth/login" className="block">
                    <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                      Login
                    </button>
                  </a>
                  <a href="/auth/register" className="block">
                    <button className="w-full px-4 py-2.5 text-white rounded-xl font-semibold text-sm shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 transition-all">
                      Register School
                    </button>
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
