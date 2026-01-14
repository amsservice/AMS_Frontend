
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔁 Resend OTP states
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  /* ------------------------------------
     Guard: email must exist
  ------------------------------------ */
  useEffect(() => {
    if (!email) {
      alert("Invalid access. Email missing.");
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
      alert("OTP must be 6 digits");
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

      alert("✅ Email verified successfully");

      router.replace(
        `/subscription/payment?email=${encodeURIComponent(email!)}`
      );

    } catch (err: any) {
      alert(err.message || "OTP verification failed");
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

      alert("📩 OTP resent successfully");
      setCooldown(60); // ⏳ lock for 60 seconds
    } catch (err: any) {
      alert(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Verify Email
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          We’ve sent a 6-digit OTP to
          <br />
          <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full h-12 border rounded-xl px-4 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <Button
          onClick={handleVerify}
          disabled={submitting}
          className="w-full mt-6 h-12 rounded-xl font-semibold"
        >
          {submitting ? "Verifying..." : "Verify OTP"}
        </Button>

        {/* 🔁 RESEND OTP */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={cooldown > 0 || resending}
            className="text-sm text-indigo-600 hover:underline disabled:text-gray-400"
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : resending
              ? "Resending..."
              : "Resend OTP"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Didn’t receive OTP? Please check spam folder.
        </p>
      </div>
    </div>
  );
}
