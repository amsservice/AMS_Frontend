"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRICING_PLANS } from "@/lib/pricing";
import { apiFetch } from "@/lib/api";

type PlanId = "6M" | "1Y" | "2Y" | "3Y";

type PricePreview = {
  planId: PlanId;
  enteredStudents: number;
  futureStudents: number;
  billableStudents: number;
  pricePerStudentPerMonth: number;
  totalMonths: number;
  monthlyCost: number;
  originalAmount: number;
  discountMonths: number;
  discountAmount: number;
  paidAmount: number;
};

type CreatePaymentResponse = {
  orderId: string;
  amount: number;
  currency: string;
  originalAmount: number;
  discountAmount: number;
  paidAmount: number;
};

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  theme?: { color?: string };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export default function PrincipalUpgradePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY!;

  const [planId, setPlanId] = useState<PlanId>("1Y");
  const [enteredStudents, setEnteredStudents] = useState<number | "">("");
  const [futureStudents, setFutureStudents] = useState<number | "">("");
  const [couponCode, setCouponCode] = useState("");
  const [price, setPrice] = useState<PricePreview | null>(null);
  const [loading, setLoading] = useState(false);

  const [invoices, setInvoices] = useState<any[]>([]);

  const [currentError, setCurrentError] = useState<string | null>(null);
  const [futureError, setFutureError] = useState<string | null>(null);
  const [planSizeError, setPlanSizeError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "6M" || planParam === "1Y" || planParam === "2Y" || planParam === "3Y") {
      setPlanId(planParam);
    }
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/subscription/invoices");
        const list =
          res && typeof res === "object" && "invoices" in res && Array.isArray((res as any).invoices)
            ? ((res as any).invoices as any[])
            : [];
        setInvoices(list);
      } catch {
        setInvoices([]);
      }
    })();
  }, []);

  const formatSubStatus = (s: string) => {
    if (s === "queued") return "Upcoming";
    if (s === "grace") return "Grace";
    if (s === "expired") return "Expired";
    return "Active";
  };

  const currentPlan = useMemo(() => {
    const active = invoices.find((i) => i.status === "active");
    if (active) return active;
    const grace = invoices.find((i) => i.status === "grace");
    if (grace) return grace;
    return null;
  }, [invoices]);

  const upcomingPlans = useMemo(() => {
    return invoices
      .filter((i) => i.status === "queued")
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [invoices]);

  const minAllowedStudents = useMemo(() => {
    if (!Array.isArray(invoices) || invoices.length === 0) return 0;
    const relevant = invoices.filter(
      (i) => i && (i.status === "active" || i.status === "grace" || i.status === "queued")
    );
    if (relevant.length === 0) return 0;
    return Math.max(...relevant.map((i) => Number(i.billableStudents || 0)));
  }, [invoices]);

  useEffect(() => {
    setPrice(null);
  }, [planId, enteredStudents, futureStudents, couponCode]);

  const frontendPlan = PRICING_PLANS.find((p) => p.id === (price?.planId ?? planId));
  const billableStudentsUI =
    price?.billableStudents ??
    (enteredStudents === "" ? 0 : enteredStudents) + (futureStudents === "" ? 0 : futureStudents);

  const uiRate = frontendPlan?.pricePerStudentPerMonth ?? 0;
  const uiMonths = frontendPlan?.durationMonths ?? 0;
  const uiMonthlyCost = billableStudentsUI * uiRate;
  const uiOriginalAmount = uiMonthlyCost * uiMonths;
  const uiDiscountMonths = price?.discountMonths ?? 0;
  const uiDiscountAmount = uiMonthlyCost * uiDiscountMonths;
  const uiPayable = uiOriginalAmount - uiDiscountAmount;

  const hasBackendMismatch = useMemo(() => {
    if (!price) return false;
    return (
      price.pricePerStudentPerMonth !== uiRate ||
      price.totalMonths !== uiMonths ||
      Math.abs(price.paidAmount - uiPayable) > 0.5
    );
  }, [price, uiRate, uiMonths, uiPayable]);

  const validateStudents = () => {
    let valid = true;

    const current = enteredStudents === "" ? 0 : enteredStudents;
    const future = futureStudents === "" ? 0 : futureStudents;

    setCurrentError(null);
    setFutureError(null);
    setPlanSizeError(null);

    const minStudentsFromPlan = Number(minAllowedStudents || 0);
    const selectedTotal = current + future;
    if (minStudentsFromPlan > 0 && selectedTotal < minStudentsFromPlan) {
      setPlanSizeError(
        `Selected students (${selectedTotal}) cannot be less than your latest plan students (${minStudentsFromPlan}).`
      );
      valid = false;
    }

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

  const previewPrice = async () => {
    if (!validateStudents()) return;

    setLoading(true);
    try {
      const data = await apiFetch("/api/subscription/upgrade/price-preview", {
        method: "POST",
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents: futureStudents || undefined,
          couponCode: couponCode || undefined
        })
      });

      setPrice(data as PricePreview);
    } catch (err: any) {
      alert(err?.message || "Failed to preview price");
    } finally {
      setLoading(false);
    }
  };

  const payNow = async () => {
    if (!price) {
      alert("Please preview price first");
      return;
    }

    if (!validateStudents()) {
      alert(planSizeError || "Please fix validation errors before paying");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load Razorpay");
        return;
      }

      const orderData = await apiFetch("/api/subscription/upgrade/create-payment", {
        method: "POST",
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents: futureStudents || undefined,
          couponCode: couponCode || undefined
        })
      });

      const order = orderData as CreatePaymentResponse;

      await apiFetch("/api/payment/create-intent-upgrade", {
        method: "POST",
        body: JSON.stringify({
          orderId: order.orderId,
          planId,
          enteredStudents,
          futureStudents: futureStudents || undefined,
          couponCode: couponCode || undefined
        })
      });

      const paidAmount = order.paidAmount;

      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) {
        alert("Failed to load Razorpay");
        return;
      }

      const rzp = new RazorpayCtor({
        key: RAZORPAY_KEY,
        amount: paidAmount * 100,
        currency: "INR",
        order_id: order.orderId,
        name: "Upastithi",
        description: "Upastithi Subscription",
        handler: async function (response: RazorpayHandlerResponse) {
          const verifyData = await apiFetch("/api/payment/verify-upgrade", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (!verifyData || !(verifyData as any).success) {
            alert("Payment verification failed");
            return;
          }

          router.replace("/dashboard/principal/schoolProfile");
        },
        theme: { color: "#2563eb" }
      });

      rzp.open();
    } catch (err: any) {
      alert(err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {(currentPlan || upcomingPlans.length) ? (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900 dark:text-white">Current Plan</div>
                <div className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white font-semibold">
                  {currentPlan ? formatSubStatus(currentPlan.status) : "-"}
                </div>
              </div>

              {currentPlan ? (
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <div><b>Plan:</b> {currentPlan.planId}</div>
                  <div><b>Students:</b> {currentPlan.billableStudents}</div>
                  <div><b>Valid:</b> {new Date(currentPlan.startDate).toLocaleDateString()} - {new Date(currentPlan.endDate).toLocaleDateString()}</div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">No active plan found.</div>
              )}
            </div>

            <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Plans</div>
              {upcomingPlans.length ? (
                <div className="mt-4 space-y-3">
                  {upcomingPlans.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900 dark:text-white">Plan {p.planId}</div>
                        <div className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-white font-semibold">{formatSubStatus(p.status)}</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        <div><b>Starts:</b> {new Date(p.startDate).toLocaleDateString()}</div>
                        <div><b>Ends:</b> {new Date(p.endDate).toLocaleDateString()}</div>
                        <div><b>Students:</b> {p.billableStudents}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">No upcoming plans queued.</div>
              )}
            </div>
          </div>
        ) : null}

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Let's get you subscribed
          </h1>
          <p className="mt-3 text-sm italic text-gray-600 dark:text-gray-300">
            Lock your plan, set the numbers — we'll do the math and you're good to go.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <motion.div
            layout
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={`rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl ${
              price ? "lg:col-span-2" : "lg:col-span-3 max-w-3xl mx-auto"
            }`}
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription Details</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Pick your plan and tell us your student count.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan</label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value as PlanId)}
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="6M">6 Months Plan</option>
                  <option value="1Y">1 Year Plan</option>
                  <option value="2Y">2 Year Plan</option>
                  <option value="3Y">3 Year Plan</option>
                </select>
              </div>

              <motion.div
                animate={shake && currentError ? { x: [-6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current students</label>
                <div className="space-y-3">
                  <div className="flex relative flex-col items-center gap-3">
                    <input
                      type="number"
                      value={enteredStudents}
                      placeholder="Enter number of students"
                      min={0}
                      max={10000}
                      step={10}
                      className={`w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border ${
                        shake && currentError
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEnteredStudents(val === "" ? "" : Number(val));
                        setCurrentError(null);
                      }}
                    />
                    {currentError && (
                      <p className="absolute -bottom-4 left-1.5 text-xs text-red-500">{currentError}</p>
                    )}
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={10}
                    value={enteredStudents === "" ? 0 : enteredStudents}
                    onChange={(e) => {
                      setEnteredStudents(Number(e.target.value));
                      setCurrentError(null);
                    }}
                    className="w-full mt-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>0</span>
                    <span>10k</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={shake && futureError ? { x: [-6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Future students (optional)</label>
                <div className="space-y-3">
                  <div className="flex relative items-center gap-3">
                    <input
                      type="number"
                      value={futureStudents}
                      placeholder="Enter number of students"
                      min={0}
                      step={5}
                      className={`w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border ${
                        shake && futureError
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
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
                    value={futureStudents === "" ? 0 : futureStudents}
                    onChange={(e) => {
                      setFutureStudents(Number(e.target.value));
                      setFutureError(null);
                    }}
                    className="w-full mt-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
              </motion.div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coupon code (optional)</label>
                <input
                  type="text"
                  placeholder="Enter coupon"
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={previewPrice}
                disabled={loading}
                className="w-full px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Preview Price"}
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              If you already have an active plan, the new plan will be queued and will start on the day your current plan ends.
            </p>

            {planSizeError ? (
              <div className="mt-4 rounded-xl px-3 py-2 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                {planSizeError}
              </div>
            ) : null}
          </motion.div>

          <AnimatePresence>
            {price && (
              <motion.div
                key="order-summary-card"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
              >
                <div className="relative">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order summary</h2>

                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Plan</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{planId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{uiRate}/student/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duration</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{uiMonths} months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Current students</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{enteredStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Future students</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{futureStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Billable students</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{billableStudentsUI}</span>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-gray-200/50 dark:bg-gray-700/50" />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span>Monthly cost</span>
                      <span>
                        {billableStudentsUI} × ₹{uiRate} = ₹{uiMonthlyCost}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span>Original</span>
                      <span>
                        ₹{uiMonthlyCost} × {uiMonths} = ₹{uiOriginalAmount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span>Discount{uiDiscountMonths ? ` (${uiDiscountMonths} months)` : ""}</span>
                      <span>₹{uiDiscountAmount}</span>
                    </div>

                    <div className="flex items-center justify-between font-bold text-base text-gray-900 dark:text-white">
                      <span>Payable</span>
                      <span>₹{uiPayable}</span>
                    </div>

                    {hasBackendMismatch ? (
                      <div className="mt-2 rounded-xl px-3 py-2 text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                        Pricing mismatch detected. UI uses `lib/pricing.ts` rates; backend preview returned a different value.
                      </div>
                    ) : null}
                  </div>

                  <button
                    onClick={payNow}
                    disabled={loading || Boolean(planSizeError)}
                    className="mt-6 w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg bg-gray-900 dark:bg-white/10 text-white hover:bg-gray-800 dark:hover:bg-white/15 border border-gray-900 dark:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Pay Securely"}
                  </button>

                  <button
                    onClick={() => router.back()}
                    disabled={loading}
                    className="mt-3 w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white/60 dark:bg-gray-700/40 hover:bg-white dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
