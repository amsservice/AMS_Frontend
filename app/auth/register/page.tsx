

// "use client";

// import { Button } from "@/components/ui/button";
// import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";
// import { getDashboardPath } from "@/lib/roleRedirect";

// export default function RegisterPage() {
//   const router = useRouter();
//   const { registerSchool, user, loading } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [form, setForm] = useState({
//     schoolName: "",
//     schoolEmail: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     principalName: "",
//     principalEmail: "",
//     principalPassword: "",
//     confirmPassword: ""
//   });

//   /* ------------------------------------
//      Redirect if already logged in
//   ------------------------------------ */
//   useEffect(() => {
//     if (!loading && user) {
//       router.replace(getDashboardPath(user.role));
//     }
//   }, [user, loading, router]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit() {
//     if (form.principalPassword !== form.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       await registerSchool({
//         schoolName: form.schoolName,
//         schoolEmail: form.schoolEmail,
//         phone: form.phone,
//         address: form.address,
//         pincode: form.pincode,
//         principalName: form.principalName,
//         principalEmail: form.principalEmail,
//         principalPassword: form.principalPassword
//       });

//       // ✅ SUCCESS ALERT
//       alert("🎉 School registered successfully!");

//       // ✅ DIRECT REDIRECT (Principal dashboard)
//       router.replace("/dashboard/principal");
//     } catch (err: any) {
//       alert(err.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-10">

//       {/* Back Button */}
//       <a
//         href="/"
//         className="fixed top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition z-50"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         <span className="hidden sm:inline">Back to Home</span>
//       </a>

//       <div className="w-full flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-2xl"
//         >
//           <div className="bg-card rounded-3xl shadow-2xl border border-border p-8 sm:p-10">

//             {/* Logo */}
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
//                 <GraduationCap className="w-8 h-8 text-primary-foreground" />
//               </div>
//               <h1 className="text-3xl font-bold">Register Your School</h1>
//               <p className="text-muted-foreground text-sm mt-1">
//                 Create your school account
//               </p>
//             </div>

//             <div className="space-y-6">

//               {/* School Info */}
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">School Information</h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <input name="schoolName" onChange={handleChange} placeholder="School Name" className="input" />
//                   <input name="schoolEmail" type="email" onChange={handleChange} placeholder="School Email" className="input" />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                   <input name="phone" onChange={handleChange} placeholder="Phone" className="input" />
//                   <input name="pincode" onChange={handleChange} placeholder="Pincode" className="input" />
//                 </div>

//                 <input name="address" onChange={handleChange} placeholder="Address" className="input mt-4" />
//               </div>

//               {/* Principal */}
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Principal Account</h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <input name="principalName" onChange={handleChange} placeholder="Full Name" className="input" />
//                   <input name="principalEmail" type="email" onChange={handleChange} placeholder="Email" className="input" />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="principalPassword"
//                     onChange={handleChange}
//                     placeholder="Password"
//                     className="input"
//                   />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     onChange={handleChange}
//                     placeholder="Confirm Password"
//                     className="input"
//                   />
//                 </div>
//               </div>

//               <Button
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-xl"
//               >
//                 {submitting ? "Creating..." : "Create Account"}
//               </Button>
//             </div>

//             <p className="text-center text-sm text-muted-foreground mt-6">
//               Already have an account?{" "}
//               <a href="/auth/login" className="text-primary font-semibold hover:underline">
//                 Login here
//               </a>
//             </p>

//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }



"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerSchool, user, loading } = useAuth();

  // 🔐 Payment params
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  const [submitting, setSubmitting] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

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
     BLOCK ACCESS IF PAYMENT NOT DONE
  ------------------------------------ */
  useEffect(() => {
    if (!orderId || !paymentId) {
      alert("❌ Payment required before registration");
      router.replace("/subscription/payment");
    }
  }, [orderId, paymentId, router]);

  /* ------------------------------------
     Redirect if already logged in
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
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("vidyarthii-theme", next ? "dark" : "light");
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (form.principalPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!orderId || !paymentId) {
      alert("Payment details missing");
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
        principalPassword: form.principalPassword,

        // 🔥 REQUIRED FOR SUBSCRIPTION
        
        orderId,
        paymentId
      });

      alert("🎉 School registered successfully!");
      router.replace("/dashboard/principal");
    } catch (err: any) {
      alert(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

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
        hintText="Secure registration"
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <main className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">Finish setting up your school</h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
              You’re one step away. Create your principal account and school profile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white/80 backdrop-blur-sm shadow-xl dark:bg-white/5 dark:ring-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center ring-1 ring-gray-200/70 bg-white dark:bg-white/5 dark:ring-white/10">
                      <GraduationCap className="w-6 h-6 text-indigo-700 dark:text-cyan-200" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">Register your school</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Use the same email you want as your school login.</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">School Information</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="schoolName" onChange={handleChange} placeholder="School Name" className="input" />
                        <input name="schoolEmail" type="email" onChange={handleChange} placeholder="School Email" className="input" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <input name="phone" onChange={handleChange} placeholder="Phone" className="input" />
                        <input name="pincode" onChange={handleChange} placeholder="Pincode" className="input" />
                      </div>

                      <input name="address" onChange={handleChange} placeholder="Address" className="input mt-4" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Principal Account</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="principalName" onChange={handleChange} placeholder="Full Name" className="input" />
                        <input name="principalEmail" type="email" onChange={handleChange} placeholder="Email" className="input" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <input type="password" name="principalPassword" onChange={handleChange} placeholder="Password" className="input" />
                        <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Confirm Password" className="input" />
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full h-12 rounded-2xl font-semibold text-white bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 hover:opacity-95"
                    >
                      {submitting ? "Creating..." : "Create Account"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white/80 backdrop-blur-sm shadow-xl dark:bg-white/5 dark:ring-white/10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What happens next?</h2>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1.</span>
                  <span>We create your school + principal account.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2.</span>
                  <span>You’ll land in the principal dashboard instantly.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3.</span>
                  <span>Add classes, teachers, and start tracking attendance.</span>
                </div>
              </div>

              <div className="my-5 h-px bg-gray-200/70 dark:bg-white/10" />

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Having trouble? Contact <span className="font-medium text-gray-700 dark:text-gray-200">support@vidyarthii.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter isDark={isDark} />
    </div>
  );
}
