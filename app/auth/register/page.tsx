


"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";

export default function RegisterPage() {
  const router = useRouter();
  const { registerSchool, user, loading } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    schoolName: "",
    schoolEmail: "",
    phone: "",
    address: "",
    pincode: "",
    principalName: "",
    principalEmail: "",
    principalPassword: "",
    confirmPassword: ""
  });

  /* ------------------------------------
     Redirect if already logged in
  ------------------------------------ */
  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, loading, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (form.principalPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      await registerSchool({
        schoolName: form.schoolName,
        schoolEmail: form.schoolEmail,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        principalName: form.principalName,
        principalEmail: form.principalEmail,
        principalPassword: form.principalPassword
      });

      alert("📩 OTP sent to your email. Please verify.");
      router.replace(
        `/auth/verify-otp?email=${encodeURIComponent(form.schoolEmail)}`
      );
    } catch (err: any) {
      alert(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b bg-white/70 border-gray-200/70 dark:bg-gray-950/70 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ring-1 bg-linear-to-br from-indigo-600 via-sky-600 to-cyan-500 ring-black/5 dark:ring-white/10">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Vidyarthii
                </span>
                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                  School management, simplified
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-300" />
              Secure registration
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white">
              Register your school
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Create your school and principal account
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white/80 backdrop-blur-sm shadow-xl dark:bg-white/5 dark:ring-white/10">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        School Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          name="schoolName"
                          onChange={handleChange}
                          placeholder="School Name"
                          className="input"
                        />
                        <input
                          name="schoolEmail"
                          type="email"
                          onChange={handleChange}
                          placeholder="School Email (Gmail)"
                          className="input"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <input
                          name="phone"
                          onChange={handleChange}
                          placeholder="Phone"
                          className="input"
                        />
                        <input
                          name="pincode"
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="input"
                        />
                      </div>
                      <input
                        name="address"
                        onChange={handleChange}
                        placeholder="Address"
                        className="input mt-4"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        Principal Account
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          name="principalName"
                          onChange={handleChange}
                          placeholder="Full Name"
                          className="input"
                        />
                        <input
                          name="principalEmail"
                          type="email"
                          onChange={handleChange}
                          placeholder="Principal Email"
                          className="input"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <input
                          type="password"
                          name="principalPassword"
                          onChange={handleChange}
                          placeholder="Password"
                          className="input"
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          onChange={handleChange}
                          placeholder="Confirm Password"
                          className="input"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full h-12 rounded-2xl font-semibold text-white bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500"
                    >
                      {submitting ? "Creating..." : "Create Account"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
