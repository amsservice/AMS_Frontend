"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Moon, Sparkles, Sun } from "lucide-react";

type PlanId = "1Y" | "2Y" | "3Y";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY!;

  const [planId, setPlanId] = useState<PlanId>("1Y");
const [enteredStudents, setEnteredStudents] = useState<number | "">("");
const [futureStudents, setFutureStudents] = useState<number | "">("");
  const [couponCode, setCouponCode] = useState("");
  const [price, setPrice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [futureError, setFutureError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "1Y" || planParam === "2Y" || planParam === "3Y") {
      setPlanId(planParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem("vidyarthii-theme");
    const initialIsDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(initialIsDark);
    document.documentElement.classList.toggle("dark", initialIsDark);
  }, []);

const validateStudents = () => {
  let valid = true;

  const current =
    enteredStudents === "" ? 0 : enteredStudents;
  const future =
    futureStudents === "" ? 0 : futureStudents;

  setCurrentError(null);
  setFutureError(null);

  if (current < 10) {
    setCurrentError("Minimum 10 students required");
    valid = false;
  }

  if (current % 10 !== 0) {
    setCurrentError("Must be multiple of 10");
    valid = false;
  }

  if (future !== 0 && future % 5 !== 0) {
    setFutureError("Must be multiple of 5");
    valid = false;
  }

  if (!valid) {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  return valid;
};


  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("vidyarthii-theme", next ? "dark" : "light");
  };

  const clampToStep = (
    value: number,
    min: number,
    max: number,
    step: number
  ) => {
    const clamped = Math.min(max, Math.max(min, value));
    const stepped = Math.round((clamped - min) / step) * step + min;
    return Math.min(max, Math.max(min, stepped));
  };

  /* ===============================
     LOAD RAZORPAY SCRIPT
  =============================== */
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ===============================
     PRICE PREVIEW
  =============================== */
  const previewPrice = async () => {
    if (!validateStudents()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/subscription/price-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents: futureStudents || undefined,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPrice(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     PAY NOW
  =============================== */
  const payNow = async () => {
    if (!price) {
      alert("Please preview price first");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load Razorpay");
        return;
      }

      /* 1️⃣ Create Razorpay order (backend decides amount) */
      const res = await fetch(`${API_URL}/api/subscription/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents: futureStudents || undefined,
          couponCode: couponCode || undefined,
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.message);

      /* 1️⃣.5️⃣ Create PaymentIntent (CRITICAL STEP) */
      await fetch(`${API_URL}/api/payment/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          planId,
          enteredStudents,
          futureStudents: futureStudents || undefined,
          couponCode: couponCode || undefined,
        }),
      });

      const paidAmount =
        typeof order.paidAmount === "number" ? order.paidAmount : order.amount;

      /* 2️⃣ Open Razorpay Checkout */
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: paidAmount * 100,
        currency: "INR",
        order_id: order.orderId,
        name: "Attendance SaaS",
        description: "School Subscription",

        handler: async function (response: any) {
          /* 3️⃣ Verify payment */
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            alert("Payment verification failed");
            return;
          }

          /* 4️⃣ Redirect to registration */
          router.push(
            `/auth/register?orderId=${verifyData.orderId}&paymentId=${verifyData.paymentId}`
          );
        },

        theme: { color: "#2563eb" },
      });

      rzp.open();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProTip = () => {
    if (planId === "1Y")
      return "Pro tip: Upgrade to 2 Years and save more long-term.";
    if (planId === "2Y")
      return "Pro tip: 3 Year plan gives you the maximum savings.";
    return "Pro tip: You already selected our best value plan 🎉";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </div>
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

      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b bg-white/70 border-gray-200/70 dark:bg-gray-950/70 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ring-1 bg-linear-to-br from-indigo-600 via-sky-600 to-cyan-500 ring-black/5 dark:from-indigo-400/25 dark:via-sky-400/20 dark:to-cyan-300/20 dark:ring-white/10">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Vidyarthii
                </span>
                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                  School management, simplified
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-300" />
                Secure checkout
              </div>

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 bg-gray-100 hover:bg-gray-200 ring-1 ring-gray-200 focus:ring-offset-white dark:bg-white/5 dark:hover:bg-white/10 dark:ring-white/10 dark:focus:ring-cyan-500/60 dark:focus:ring-offset-gray-950"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Let’s get you subscribed
            </h1>
            <p className="mt-3 text-sm italic text-gray-700 dark:text-gray-300">
              Lock your plan, set the numbers — we’ll do the math and you’re
              good to go.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <motion.div
              layout
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className={`rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white/80 backdrop-blur-sm shadow-xl dark:bg-white/5 dark:ring-white/10
    ${price ? "lg:col-span-2" : "lg:col-span-3 max-w-3xl mx-auto"}`}
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Subscription Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Pick your plan and tell us your student count.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Plan
                  </label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value as PlanId)}
                    className="w-full rounded-xl px-4 py-3 ring-1 ring-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60"
                  >
                    <option value="1Y">1 Year Plan</option>
                    <option value="2Y">2 Year Plan</option>
                    <option value="3Y">3 Year Plan</option>
                  </select>
                </div>

                <motion.div
                  animate={
                    shake && currentError ? { x: [-6, 6, -4, 4, 0] } : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Current students
                  </label>
                  <div className="space-y-3">
                    <div className="flex relative flex-col items-center gap-3">
                      <input
                        type="number"
                        value={enteredStudents}
                        placeholder="Enter number of students"
                        min={0}
                        max={10000}
                        step={10}
                        className={`w-full rounded-xl px-4 py-3 ring-1 ring-gray-200 ${shake && currentError ? "ring-red-500" : ""} bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60`}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEnteredStudents(val === "" ? "" : Number(val));
                          setCurrentError(null);
                        }}
                      />
                      {currentError && (
                        <p className="absolute -bottom-4 left-1.5 text-xs text-red-500">
                          {currentError}
                        </p>
                      )}
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={10000}
                      step={10}
                      value={enteredStudents}
                      onChange={(e) =>
                        {
                          setEnteredStudents(Number(e.target.value));
                          setCurrentError(null);   // ✅ clear error
                        }
                      }
                      className="w-full mt-2"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>0</span>
                      <span>10k</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={shake && futureError ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Future students (optional)
                  </label>
                  <div className="space-y-3">
                    <div className="flex relative items-center gap-3">
                      <input
                        type="number"
                        value={futureStudents}
                        placeholder="Enter number of students"
                        min={0}
                        step={5}
                        className={`w-full rounded-xl ${shake && futureError ? "ring-red-500" : ""} px-4 py-3 ring-1 ring-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60`}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFutureStudents(val === "" ? "" : Number(val));
                          setFutureError(null);
                        }}

                      />
                      {futureError && (
                      <p className="-bottom-4 left-1.5 absolute text-xs text-red-500">{futureError}</p>
                    )}
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={futureStudents}
                      onChange={(e) =>
                        {
                          setFutureStudents(Number(e.target.value));
                          setFutureError(null);   // ✅ clear error
                        }
                      }
                      className="w-full mt-2"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                </motion.div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Coupon code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter coupon"
                    className="w-full rounded-xl px-4 py-3 ring-1 ring-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60"
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={previewPrice}
                  disabled={loading}
                  className="w-full px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 focus:ring-offset-white dark:from-indigo-500 dark:via-sky-500 dark:to-cyan-500 dark:focus:ring-cyan-500/60 dark:focus:ring-offset-gray-950"
                >
                  {loading ? "Loading..." : "Preview Price"}
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                After payment verification, you’ll be redirected to complete
                school registration.
              </p>
            </motion.div>

            <AnimatePresence>
              {price && (
                <motion.div
                  key="order-summary-card"
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white shadow-xl dark:bg-white/5 dark:ring-white/10"
                >
                  <div className="relative">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Order summary
                    </h2>

                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-between">
                        <span>Plan</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {planId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Current students</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {enteredStudents}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Future students</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {futureStudents}
                        </span>
                      </div>
                    </div>

                    <div className="my-5 h-px bg-gray-200/70 dark:bg-white/10" />

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="space-y-2 text-sm"
                    >
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span>Original</span>
                        <span>₹{price.originalAmount}</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span>Discount</span>
                        <span>₹{price.discountAmount}</span>
                      </div>

                      <div className="flex items-center justify-between font-semibold text-base text-gray-900 dark:text-white">
                        <span>Payable</span>
                        <span>₹{price.paidAmount}</span>
                      </div>
                    </motion.div>

                    <div className="mt-4 mb-4 rounded-2xl p-4 ring-1 ring-gray-200/70 bg-white/60 dark:bg-white/5 dark:ring-white/10">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Pro tip
                      </div>
                      <div className="mt-1 text-xs text-gray-700 dark:text-gray-400">
                        {getProTip()}
                      </div>
                    </div>

                    <button
                      onClick={payNow}
                      disabled={loading}
                      className="mt-2 w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/60 focus:ring-offset-white bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:ring-1 dark:ring-white/20 dark:focus:ring-cyan-500/60 dark:focus:ring-offset-gray-950"
                    >
                      {loading ? "Processing..." : "Pay Securely"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="py-10 px-4 sm:px-6 border-t bg-white border-gray-200/70 dark:bg-gray-950 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              support@vidyarthii.com
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              &copy; 2025 Vidyarthii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// type PlanMeta = {
//   label: string;
//   price: number;
//   duration: string;
//   save?: string; // ✅ optional
// };

// type PlanId = '1Y' | '2Y' | '3Y';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const PLAN_META: Record<PlanId, PlanMeta> = {
//   '1Y': {
//     label: '1 Year Plan',
//     price: 120,
//     duration: 'for 1 Year'
//   },
//   '2Y': {
//     label: '2 Year Plan',
//     price: 200,
//     duration: 'for 2 Years',
//     save: 'Save 17%'
//   },
//   '3Y': {
//     label: '3 Year Plan',
//     price: 270,
//     duration: 'for 3 Years',
//     save: 'Save 25%'
//   }
// };

// export default function PaymentPage() {
//   const router = useRouter();

//   const API_URL = process.env.NEXT_PUBLIC_API_URL!;
//   const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY!;

//   const [planId, setPlanId] = useState<PlanId>('1Y');
//   const [enteredStudents, setEnteredStudents] = useState<number>(100);
//   const [futureStudents, setFutureStudents] = useState<number>(0);
//   const [couponCode, setCouponCode] = useState('');
//   const [price, setPrice] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   /* ===============================
//      LOAD RAZORPAY SCRIPT
//   =============================== */
//   const loadRazorpay = () => {
//     return new Promise<boolean>((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   /* ===============================
//      AUTO PRICE PREVIEW
//   =============================== */
//   useEffect(() => {
//     if (enteredStudents < 10) return;
//     previewPrice();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [planId, enteredStudents, futureStudents]);

//   const previewPrice = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/subscription/price-preview`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           planId,
//           enteredStudents,
//           futureStudents,
//           couponCode: couponCode || undefined
//         })
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setPrice(data);
//     } catch (err: any) {
//       console.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===============================
//      PAY NOW
//   =============================== */
//   const payNow = async () => {
//     if (!price) return alert('Please preview price first');
//     setLoading(true);

//     try {
//       const loaded = await loadRazorpay();
//       if (!loaded) throw new Error('Razorpay SDK failed');

//       const res = await fetch(`${API_URL}/api/subscription/create-payment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           planId,
//           enteredStudents,
//           futureStudents,
//           couponCode: couponCode || undefined
//         })
//       });

//       const order = await res.json();
//       if (!res.ok) throw new Error(order.message);

//       await fetch(`${API_URL}/api/payment/create-intent`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           orderId: order.orderId,
//           planId,
//           enteredStudents,
//           futureStudents,
//           couponCode: couponCode || undefined
//         })
//       });

//       const rzp = new window.Razorpay({
//         key: RAZORPAY_KEY,
//         amount: order.paidAmount * 100,
//         currency: 'INR',
//         order_id: order.orderId,
//         name: 'AttendEase',
//         description: 'School Subscription',
//         handler: async (response: any) => {
//           const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(response)
//           });

//           const verifyData = await verifyRes.json();
//           if (!verifyRes.ok || !verifyData.success)
//             return alert('Payment verification failed');

//           router.push(
//             `/auth/register?orderId=${verifyData.orderId}&paymentId=${verifyData.paymentId}`
//           );
//         },
//         theme: { color: '#2563eb' }
//       });

//       rzp.open();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard-bg min-h-screen py-14">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold dashboard-text">
//             Choose Your Subscription Plan
//           </h1>
//           <p className="dashboard-text-muted mt-2">
//             Full access to attendance, reports & analytics
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* LEFT */}
//           <div className="lg:col-span-2 dashboard-card shadow-dashboard-lg rounded-xl p-6 space-y-6">
//             <h2 className="text-xl font-semibold dashboard-text">
//               Select Your Plan
//             </h2>

//             {Object.entries(PLAN_META).map(([id, plan]) => (
//               <label
//                 key={id}
//                 className={`dashboard-card border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-dashboard ${
//                   planId === id ? 'border-accent-blue' : ''
//                 }`}
//               >
//                 <div className="flex gap-3 items-start">
//                   <input
//                     type="radio"
//                     checked={planId === id}
//                     onChange={() => setPlanId(id as PlanId)}
//                     className="mt-1"
//                   />
//                   <div>
//                     <p className="font-semibold dashboard-text">
//                       {plan.label}
//                     </p>
//                     <p className="dashboard-text-muted text-sm">
//                       ₹{plan.price}/student {plan.duration}
//                     </p>
//                   </div>
//                 </div>
//                 {plan.save && (
//                   <span className="badge-success">{plan.save}</span>
//                 )}
//               </label>
//             ))}

//             {/* Students */}
//             <div>
//               <label className="font-medium dashboard-text">
//                 Number of Students
//               </label>
//               <input
//                 type="number"
//                 min={10}
//                 value={enteredStudents}
//                 onChange={(e) => setEnteredStudents(+e.target.value)}
//                 className="dashboard-input w-full mt-2 rounded-md px-3 py-2"
//               />
//               <p className="text-xs dashboard-text-muted mt-1">
//                 Minimum 10 students required
//               </p>
//             </div>

//             {/* Future */}
//             <div>
//               <label className="font-medium dashboard-text">
//                 Future Students (optional)
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 value={futureStudents}
//                 onChange={(e) => setFutureStudents(+e.target.value)}
//                 className="dashboard-input w-full mt-2 rounded-md px-3 py-2"
//               />
//             </div>

//             {/* Coupon */}
//             <div>
//               <label className="font-medium dashboard-text">Coupon Code</label>
//               <div className="flex gap-2 mt-2">
//                 <input
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value)}
//                   placeholder="Enter coupon"
//                   className="dashboard-input flex-1 rounded-md px-3 py-2"
//                 />
//                 <button
//                   onClick={previewPrice}
//                   className="btn-secondary"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="dashboard-card shadow-dashboard-lg rounded-xl p-6 space-y-4">
//             <h2 className="text-xl font-semibold dashboard-text">
//               Order Summary
//             </h2>

//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Plan</span>
//                 <span>{PLAN_META[planId].label}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Students</span>
//                 <span>{enteredStudents}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Price / Student</span>
//                 <span>₹{PLAN_META[planId].price}</span>
//               </div>
//             </div>

//             <hr className="border-border" />

//             <div className="flex justify-between font-bold text-lg">
//               <span>Total</span>
//               <span className="text-accent-blue">
//                 ₹{price?.paidAmount ?? '--'}
//               </span>
//             </div>

//             <button
//               onClick={payNow}
//               disabled={loading || !price}
//               className="btn-primary w-full mt-4"
//             >
//               {loading ? 'Processing…' : 'Continue to Payment'}
//             </button>

//             <ul className="text-sm dashboard-text-muted space-y-1 mt-4">
//               <li>✔ Full access to all features</li>
//               <li>✔ Unlimited teachers & classes</li>
//               <li>✔ Priority support</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
