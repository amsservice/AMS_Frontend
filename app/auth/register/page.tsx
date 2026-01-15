



"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import { registerSchoolSchema } from "@/lib/zodSchema";
import { z } from "zod";

const UpasthitiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpasthitiPageLoader").then(
      (m) => m.UpasthitiPageLoader
    ),
  { ssr: false }
);

export default function RegisterPage() {
  const router = useRouter();
  const { registerSchool, user, loading } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  //Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, loading, router]);

useEffect(() => {
  const start = Date.now();

  const savedTheme = window.localStorage.getItem("Upasthiti-theme");
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
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("Upasthiti-theme", next ? "dark" : "light");
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  async function handleSubmit() {
    try {
      // Validate form data
      registerSchoolSchema.parse(form);
      setErrors({});

      setSubmitting(true);

      const registerPromise = registerSchool({
        schoolName: form.schoolName,
        schoolEmail: form.schoolEmail,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        principalName: form.principalName,
        principalEmail: form.principalEmail,
        principalPassword: form.principalPassword,
      });

      toast.promise(registerPromise, {
        loading: "Otp sending...",
        success: "OTP sent to your email",
        error: (err) => (err instanceof Error ? err.message : "Registration failed"),
      });

      await registerPromise;

      router.replace(
        `/auth/verify-otp?email=${encodeURIComponent(form.schoolEmail)}`
      );
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      } else {
        // Handle API errors (like email already registered)
        const errorMessage = err?.response?.data?.message || err?.message || "Registration failed";
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (showLoader || !mounted) {
    return <UpasthitiPageLoader />;
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
        hintText="Secure registration"
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <main className="relative pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Finish setting up your school
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              You're one step away. Create your principal account and school profile.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8">
                  {/* Form Header */}
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">Register your school</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Use the same email you want as your school login.</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* School Information */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">School Information</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input 
                            name="schoolName" 
                            onChange={handleChange} 
                            placeholder="School Name" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.schoolName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>}
                        </div>
                        <div>
                          <input 
                            name="schoolEmail" 
                            type="email" 
                            onChange={handleChange} 
                            placeholder="School Email" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.schoolEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.schoolEmail && <p className="text-red-500 text-xs mt-1">{errors.schoolEmail}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <input 
                            name="phone" 
                            onChange={handleChange} 
                            placeholder="Phone" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                          <input 
                            name="pincode" 
                            onChange={handleChange} 
                            placeholder="Pincode" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.pincode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                        </div>
                      </div>

                      <div className="mt-4">
                        <input 
                          name="address" 
                          onChange={handleChange} 
                          placeholder="Address" 
                          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>
                    </div>

                    {/* Principal Account */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Principal Account</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input 
                            name="principalName" 
                            onChange={handleChange} 
                            placeholder="Full Name" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.principalName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.principalName && <p className="text-red-500 text-xs mt-1">{errors.principalName}</p>}
                        </div>
                        <div>
                          <input 
                            name="principalEmail" 
                            type="email" 
                            onChange={handleChange} 
                            placeholder="Email" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.principalEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.principalEmail && <p className="text-red-500 text-xs mt-1">{errors.principalEmail}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <input 
                            type="password" 
                            name="principalPassword" 
                            onChange={handleChange} 
                            placeholder="Password" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.principalPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.principalPassword && <p className="text-red-500 text-xs mt-1">{errors.principalPassword}</p>}
                        </div>
                        <div>
                          <input 
                            type="password" 
                            name="confirmPassword" 
                            onChange={handleChange} 
                            placeholder="Confirm Password" 
                            className={`px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full`}
                          />
                          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Creating..." : "Create Account"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Info Sidebar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 h-fit">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What happens next?</h2>
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">1.</span>
                  <span>We create your school + principal account.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">2.</span>
                  <span>You'll land in the principal dashboard instantly.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">3.</span>
                  <span>Add classes, teachers, and start tracking attendance.</span>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-200 dark:bg-gray-700" />

              <div className="text-xs text-gray-600 dark:text-gray-400">
                Having trouble? Contact <span className="font-semibold text-gray-900 dark:text-white">support@Upasthiti.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter isDark={isDark} />
    </div>
  );
}