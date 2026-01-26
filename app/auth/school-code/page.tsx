"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import dynamic from "next/dynamic";
import Link from "next/link";

const UpastithiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpastithiPageLoader").then(
      (m) => m.UpastithiPageLoader
    ),
  { ssr: false }
);

export default function SchoolCodePage() {
  const router = useRouter();

  const [schoolCode, setSchoolCode] = useState(["", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {

    if(localStorage.getItem("schoolContext")) {
      router.replace("/auth/login");
      return;
    }

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

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("Upastithi-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && isNaN(Number(value))) return;

    const newCode = [...schoolCode];
    newCode[index] = value;
    setSchoolCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !schoolCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const digits = pastedData.split("").filter((char) => !isNaN(Number(char)));
    
    const newCode = [...schoolCode];
    digits.forEach((digit, index) => {
      if (index < 4) {
        newCode[index] = digit;
      }
    });
    setSchoolCode(newCode);

    // Focus last filled input or next empty
    const lastIndex = Math.min(digits.length - 1, 3);
    inputRefs.current[lastIndex]?.focus();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const code = schoolCode.join("");
    if (code.length !== 4 || isNaN(Number(code))) {
      toast.error("Please enter a valid 4-digit school code");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/school/by-code/${code}`
      );

      if (!res.ok) {
        throw new Error("Invalid school code");
      }

      const data = await res.json();

      localStorage.setItem(
        "schoolContext",
        JSON.stringify({
          schoolId: data.school.id,
          schoolCode: data.school.schoolCode,
          schoolName: data.school.name
        })
      );

      toast.success("School verified");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message || "Invalid school code");
    } finally {
      setSubmitting(false);
    }
  }

  if (showLoader || !mounted) {
    return <UpastithiPageLoader />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-black overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl bg-blue-400/20 dark:bg-blue-500/10 animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full blur-3xl bg-indigo-400/20 dark:bg-indigo-500/10 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full blur-3xl bg-purple-400/20 dark:bg-purple-500/10 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full blur-3xl bg-cyan-400/15 dark:bg-cyan-500/8 animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <MainNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        hintText="Secure access"
        showAuthButtons={false}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" }
        ]}
      />

      <div className="relative flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Main Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/60 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-8 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative inline-flex items-centeSchool Verificationr justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-3 shadow-xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="relative text-3xl font-bold text-white mb-2">
                School Verification
              </h1>
              <p className="relative text-blue-100">
                Enter your institution's unique code to continue
              </p>
            </div>

            {/* Form Section */}
            <div className="px-8 py-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
                    School Code
                  </label>
                  
                  {/* Code Input Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {schoolCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 outline-none transition-all shadow-sm hover:shadow-md"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    Enter 4 digit School Code
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || schoolCode.join("").length < 4}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white font-semibold text-base rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Info Section */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      Need your school code?
                    </p>
                    <p>
                      Contact your school administrator or check your enrollment documents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                    Don't have an account?{" "}
                    <a href="/auth/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Register your school
                    </a>
                  </p>

                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Having trouble?{" "}
                    <a
                      href="/contact"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Contact Support
                    </a>
                  </p>
                </div>
            </div>
          </div>
        </motion.div>
      </div>

      <MainFooter isDark={isDark} />
    </div>
  );
}