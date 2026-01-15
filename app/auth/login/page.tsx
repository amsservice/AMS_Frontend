// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { GraduationCap, Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useAuth } from "@/app/context/AuthContext";
// import { getDashboardPath } from "@/lib/roleRedirect";
// import MainNavbar from "@/components/main/MainNavbar";
// import MainFooter from "@/components/main/MainFooter";
// import dynamic from "next/dynamic";

// const UpasthitiPageLoader = dynamic(
//   () =>
//     import("@/components/loader/UpasthitiPageLoader").then(
//       (m) => m.UpasthitiPageLoader
//     ),
//   { ssr: false }
// );
// type Role = "principal" | "teacher" | "student";

// export default function LoginPage() {
//   const router = useRouter();
//   const { login, user, loading } = useAuth();

//   const [role, setRole] = useState<Role>("principal");
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [isDark, setIsDark] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [showLoader, setShowLoader] = useState(true);


//   const [form, setForm] = useState({
//     email: "",
//     password: ""
//   });

//   useEffect(() => {
//     if (!loading && user) {
//       router.replace(getDashboardPath(user.role));
//     }
//   }, [user, loading, router]);

// useEffect(() => {
//   const start = Date.now();

//   const savedTheme = window.localStorage.getItem("Upasthiti-theme");
//   const initialIsDark = savedTheme
//     ? savedTheme === "dark"
//     : window.matchMedia("(prefers-color-scheme: dark)").matches;

//   setIsDark(initialIsDark);
//   document.documentElement.classList.toggle("dark", initialIsDark);

//   const elapsed = Date.now() - start;
//   const remaining = Math.max(500 - elapsed, 0); // minimum 0.5s

//   const timer = setTimeout(() => {
//     setMounted(true);
//     setShowLoader(false);
//   }, remaining);

//   return () => clearTimeout(timer);
// }, []);


//   const toggleTheme = () => {
//     const next = !isDark;
//     setIsDark(next);
//     window.localStorage.setItem("Upasthiti-theme", next ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", next);
//   };

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!form.email || !form.password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const loginPromise = login(role, {
//         email: form.email,
//         password: form.password,
//       });

//       toast.promise(loginPromise, {
//         loading: "Logging in...",
//         success: "Logged in successfully",
//         error: (err) => (err instanceof Error ? err.message : "Login failed"),
//       });

//       await loginPromise;
//     } catch (err: any) {
//       // toast.promise handles UI; keep catch to avoid unhandled rejections
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (showLoader  ) {
//     return <UpasthitiPageLoader />
//   }

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-black overflow-hidden">
//       {/* Background Blur Effects */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl bg-violet-500/20 dark:bg-violet-500/10" />
//         <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl bg-cyan-500/20 dark:bg-cyan-500/10" />
//         <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl bg-sky-500/20 dark:bg-sky-500/10" />
//         <div className="absolute -bottom-28 -right-12 h-72 w-72 rounded-full blur-3xl bg-indigo-500/20 dark:bg-indigo-500/10" />
//       </div>

//       <MainNavbar
//         isDark={isDark}
//         onToggleTheme={toggleTheme}
//         hintText="Secure login"
//         showAuthButtons={false}
//         navLinks={[
//           { label: "Home", href: "/" },
//           { label: "Pricing", href: "/pricing" },
//           { label: "Contact", href: "/contact" },
//         ]}
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative w-full max-w-md mx-auto pt-32 pb-16 px-4 sm:px-6"
//       >
//         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
//               <GraduationCap className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
//             <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
//               Login to your dashboard
//             </p>
//           </div>

//           {/* Role Selection */}
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {(["principal", "teacher", "student"] as Role[]).map(r => (
//               <button
//                 key={r}
//                 type="button"
//                 onClick={() => setRole(r)}
//                 className={`py-3 rounded-xl border font-semibold transition-all duration-200 transform hover:scale-105 ${
//                   role === r
//                     ? "border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
//                     : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
//                 }`}
//               >
//                 {r.charAt(0).toUpperCase() + r.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="you@school.edu"
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12 transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               disabled={submitting}
//               className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {submitting ? "Logging in..." : "Login"}
//             </Button>
//           </form>

//           {/* Register Link */}
//           <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/auth/register"
//               className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline"
//             >
//               Register your school
//             </Link>
//           </p>
//         </div>
//       </motion.div>
      
//       <MainFooter isDark={isDark} />
//     </div>
//   );
// }



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

const UpasthitiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpasthitiPageLoader").then(
      (m) => m.UpasthitiPageLoader
    ),
  { ssr: false }
);
type Role = "principal" | "teacher" | "student";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [role, setRole] = useState<Role>("principal");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const remaining = Math.max(500 - elapsed, 0); // minimum 0.5s

  const timer = setTimeout(() => {
    setMounted(true);
    setShowLoader(false);
  }, remaining);

  return () => clearTimeout(timer);
}, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("Upasthiti-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Validate form data
      loginSchema.parse(form);
      setErrors({});

      setSubmitting(true);

      await login(role, {
        email: form.email,
        password: form.password,
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
        toast.error("Please fix the errors in the form");
      } else {
        // Handle API errors (like invalid credentials)
        const errorMessage = err?.response?.data?.message || err?.message || "Login failed";
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (showLoader  ) {
    return <UpasthitiPageLoader />
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
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
                className={`py-3 rounded-xl border font-semibold transition-all duration-200 transform hover:scale-105 ${
                  role === r
                    ? "border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@school.edu"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline"
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