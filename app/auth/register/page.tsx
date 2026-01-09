

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
import { GraduationCap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getDashboardPath } from "@/lib/roleRedirect";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerSchool, user, loading } = useAuth();

  // 🔐 Payment params
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-10">
      <a
        href="/"
        className="fixed top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition z-50"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </a>

      <div className="w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-card rounded-3xl shadow-2xl border border-border p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">Register Your School</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create your school account
              </p>
            </div>

            <div className="space-y-6">
              {/* School Info */}
              <div>
                <h2 className="text-lg font-semibold mb-4">School Information</h2>

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

              {/* Principal */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Principal Account</h2>

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
                className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-xl"
              >
                {submitting ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
