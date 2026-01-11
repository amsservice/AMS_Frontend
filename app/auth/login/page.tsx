

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";

type Role = "principal" | "teacher" | "student";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [role, setRole] = useState<Role>("principal");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  /* ------------------------------------
     Redirect AFTER user is available
  ------------------------------------ */
  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, loading, router]);

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Email and password are required");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ wait for login to fully complete
      await login(role, {
        email: form.email,
        password: form.password
      });

      // ❌ DO NOT redirect here
      // Redirect is handled by useEffect
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  /* ------------------------------------
     UI
  ------------------------------------ */
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
    <div className="relative isolate min-h-screen bg-linear-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl bg-violet-500/10 dark:bg-violet-500/8" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl bg-cyan-500/14 dark:bg-cyan-500/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl bg-sky-500/12 dark:bg-sky-500/10" />
        <div className="absolute -bottom-28 -right-12 h-72 w-72 rounded-full blur-3xl bg-indigo-500/12 dark:bg-indigo-500/10" />
      </div>

      <MainNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        hintText="Secure login"
        showAuthButtons={false}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto pt-32 pb-16 px-4 sm:px-6"
      >
        <div className="rounded-3xl p-8 ring-1 ring-gray-200/70 bg-white/80 backdrop-blur-sm shadow-2xl dark:bg-white/5 dark:ring-white/10">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-600 via-sky-600 to-cyan-500 flex items-center justify-center shadow-lg ring-1 ring-black/5 dark:from-indigo-400/25 dark:via-sky-400/20 dark:to-cyan-300/20 dark:ring-white/10">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Login to your dashboard
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["principal", "teacher", "student"] as Role[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-xl font-medium transition ring-1 ${
                  role === r
                    ? isDark
                      ? "ring-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                      : "ring-indigo-500/30 bg-indigo-500/10 text-indigo-700"
                    : isDark
                      ? "ring-white/10 text-gray-300 hover:bg-white/5"
                      : "ring-gray-200 text-gray-600 hover:bg-white"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@school.edu"
                className="w-full mt-1 px-4 py-3 rounded-xl ring-1 ring-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 pr-12 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-2xl font-semibold text-white bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 hover:opacity-95"
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              Register your school
            </Link>
          </p>
        </div>
      </motion.div>
      <MainFooter isDark={isDark} />
    </div>
  );
}

