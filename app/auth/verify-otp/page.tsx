"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import dynamic from "next/dynamic";
import { apiFetch } from "@/lib/api";

const UpastithiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpastithiPageLoader").then(
      (m) => m.UpastithiPageLoader
    ),
  { ssr: false }
);

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const planParam = searchParams.get("plan");
  const planQuery = planParam ? `&plan=${encodeURIComponent(planParam)}` : "";

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔁 Resend OTP states
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

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

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("Upastithi-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  /* ------------------------------------
     Guard: email must exist
  ------------------------------------ */
  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Email missing.");
      router.replace("/auth/register");
    }
  }, [email, router]);

  /* ------------------------------------
     Cooldown Timer
  ------------------------------------ */
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ------------------------------------
     VERIFY OTP
  ------------------------------------ */
  async function handleVerify() {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setSubmitting(true);

      await apiFetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp
        })
      });

      toast.success("Email verified successfully");

      router.replace(
        `/subscription/payment?email=${encodeURIComponent(email!)}${planQuery}`
      );

    } catch (err: any) {
      toast.error(err.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  /* ------------------------------------
     RESEND OTP (RATE LIMITED)
  ------------------------------------ */
  async function handleResendOtp() {
    if (!email || cooldown > 0) return;

    try {
      setResending(true);

      await apiFetch("/api/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      toast.success("OTP resent successfully");
      setCooldown(60); // ⏳ lock for 60 seconds
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  if (showLoader || !mounted) {
    return <UpastithiPageLoader />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-black overflow-hidden">
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
        hintText="Email verification"
        showAuthButtons={false}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" }
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verify Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              We've sent a 6-digit OTP to
            </p>
            <p className="text-gray-900 dark:text-white font-medium text-sm mt-1">
              {email}
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-5">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyPress={handleKeyPress}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />

            <Button
              onClick={handleVerify}
              disabled={submitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              {submitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || resending}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400 dark:disabled:text-gray-600 transition-colors"
            >
              {cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : resending
                ? "Resending..."
                : "Resend OTP"}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Didn't receive OTP? Please check spam folder.
          </p>
        </div>
      </motion.div>

      <MainFooter isDark={isDark} />
    </div>
  );
}