"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import dynamic from "next/dynamic";
import { loginSchema } from "@/lib/zodSchema";
import { z } from "zod";

const UpastithiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpastithiPageLoader").then(
      (m) => m.UpastithiPageLoader,
    ),
  { ssr: false },
);

type Role = "principal" | "teacher" | "student";

/* ===============================
   SCHOOL THEME PALETTE
=============================== */
const SCHOOL_THEMES = [
  "from-blue-600 via-indigo-600 to-purple-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-rose-600 via-pink-600 to-fuchsia-600",
  "from-orange-600 via-amber-600 to-yellow-500",
  "from-violet-600 via-purple-600 to-indigo-600",
  "from-sky-600 via-blue-600 to-indigo-600",
  "from-teal-600 via-cyan-600 to-sky-600",
  "from-lime-600 via-green-600 to-emerald-600",
  "from-red-600 via-rose-600 to-pink-600",
  "from-indigo-700 via-purple-700 to-fuchsia-700",
];

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [role, setRole] = useState<Role>("principal");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [schoolContextReady, setSchoolContextReady] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [schoolTheme, setSchoolTheme] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ===============================
     REDIRECT IF LOGGED IN
  =============================== */
  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.activeRole));
    }
  }, [user, loading, router]);

  /* ===============================
     GUARD: REQUIRE SCHOOL CONTEXT
  =============================== */
  useEffect(() => {
    const stored = localStorage.getItem("schoolContext");
    if (!stored) {
      router.replace("/auth/school-code");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.schoolCode == null) {
        router.replace("/auth/school-code");
        return;
      }
    } catch {
      router.replace("/auth/school-code");
      return;
    }

    setSchoolContextReady(true);
  }, []);

  /* ===============================
     THEME INIT
  =============================== */
  useEffect(() => {
    const start = Date.now();

    const savedTheme = window.localStorage.getItem("Upastithi-theme");
    const initialIsDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(initialIsDark);
    document.documentElement.classList.toggle("dark", initialIsDark);

    const elapsed = Date.now() - start;
    const remaining = Math.max(500 - elapsed, 0);

    const timer = setTimeout(() => {
      setMounted(true);
      setShowLoader(false);
    }, remaining);

    return () => clearTimeout(timer);
  }, []);

  /* ===============================
     LOAD SCHOOL CONTEXT
  =============================== */
  useEffect(() => {
    const stored = localStorage.getItem("schoolContext");
    console.log(stored, "stored");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setSchoolName(parsed.schoolName || null);

      if (parsed.schoolCode) {
        const index = Math.floor(Math.random() * SCHOOL_THEMES.length);
        setSchoolTheme(SCHOOL_THEMES[index]);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("Upastithi-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  function handleChangeSchool() {
    localStorage.removeItem("schoolContext");
    router.replace("/auth/school-code");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      loginSchema.parse(form);
      setErrors({});
      setSubmitting(true);

      // ✅ READ SCHOOL CODE FROM LOCAL STORAGE
      const stored = localStorage.getItem("schoolContext");

      if (!stored) {
        toast.error("School not selected. Please enter school code again.");
        router.replace("/auth/school-code");
        return;
      }

      const parsed = JSON.parse(stored);

      if (!parsed.schoolCode) {
        toast.error("Please re-enter school code.");
        router.replace("/auth/school-code");
        return;
      }

      await login(role, {
        email: form.email,
        password: form.password,
        schoolCode: Number(parsed.schoolCode),
      });

      toast.success("Logged in successfully");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        console.log("Field errors:", fieldErrors);
        toast.error("Invalid credentials");
      } else {
        toast.error(
          err?.response?.data?.message || err?.message || "Login failed",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!schoolContextReady) {
    return null;
  }

  if (showLoader || !mounted) {
    return <UpastithiPageLoader />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-black overflow-hidden">
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
        className="relative w-full max-w-md mx-auto pt-32 pb-16 px-4 sm:px-6"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
                schoolTheme ?? "from-blue-600 to-indigo-600"
              } flex items-center justify-center shadow-lg`}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {schoolName ? `Welcome to ${schoolName}` : "Welcome Back"}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Login to your dashboard
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["principal", "teacher", "student"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 rounded-xl border font-semibold transition-all duration-200 transform hover:scale-105 ${
                  role === r
                    ? `border-blue-500 bg-gradient-to-r ${
                        schoolTheme ??
                        "from-blue-600 via-indigo-600 to-purple-600"
                      } text-white shadow-lg`
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@school.edu"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className={`w-full h-12 bg-gradient-to-r ${
                schoolTheme ?? "from-blue-600 via-indigo-600 to-purple-600"
              } text-white font-semibold rounded-xl shadow-lg`}
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-700/60 text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Getting started?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition"
              >
                Register your school today
              </Link>
            </p>

            <p className="text-sm italic text-gray-500 dark:text-gray-400">
              Landed on the wrong school?{" "}
              <button
                onClick={handleChangeSchool}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline transition"
              >
                Change it here
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      <MainFooter isDark={isDark} />
    </div>
  );
}
