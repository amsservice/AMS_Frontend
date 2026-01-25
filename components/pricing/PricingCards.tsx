"use client";

import Link from "next/link";
import { PRICING_PLANS } from "@/lib/pricing";
import { Sparkles } from "lucide-react";

type PricingCardsProps = {
  isDark: boolean;
  upgradeMode?: boolean;
};

export default function PricingCards({ isDark, upgradeMode }: PricingCardsProps) {
  const displayPlans = PRICING_PLANS.filter((p) => p.id !== "6M");

  const setSelectedPlan = (planId: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("selectedPlanId", planId);
    } catch {
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Starter Plan - 6 Month Trial at ₹1 - MATCHED THEME */}
        {!upgradeMode ? (
          <div className="relative rounded-3xl p-8 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-500 dark:border-purple-400 shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 transform">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-purple-500 to-violet-500 text-white flex items-center gap-2 whitespace-nowrap">
              <Sparkles className="w-4 h-4" />
              Beginners Friendly
            </div>

            {/* <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md">
              Limited Time
            </div> */}

            <div className="text-center mt-6">
              <h3 className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-400">
                Starter Plan
              </h3>

              <div className="flex items-baseline justify-center mb-2">
                <span className="mr-3 text-lg font-semibold line-through text-gray-500 dark:text-gray-400">
                  ₹4,999
                </span>

                <span className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                  ₹1
                </span>
              </div>

              <p className="text-sm mb-2 text-purple-600 dark:text-purple-400 font-semibold">
                For 6 months trial
              </p>
              <p className="text-xs mb-6 text-gray-600 dark:text-gray-400">
                Per student/month (paid upfront)
              </p>

              <div className="p-4 rounded-xl mb-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-700 shadow-inner">
                <p className="text-xs mb-1 text-gray-600 dark:text-gray-400 font-medium">Perfect for:</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Unlimited Students
                </p>
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                  Core features included • Ideal for small & growing schools
                </p>
              </div>

              <Link
                href="/auth/register?plan=6M"
                className="block"
                onClick={() => setSelectedPlan("6M")}
              >
                <button className="w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.98] shadow-lg bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white hover:shadow-purple-500/50 hover:shadow-2xl">
                  Start Trial for ₹1
                </button>
              </Link>

              <p className="text-xs mt-3 text-gray-600 dark:text-gray-400 font-medium">
                Full access • Cancel anytime
              </p>
            </div>
          </div>
        ) : null}

        {/* Regular Plans */}
        {displayPlans.map((plan) => {
          const monthlyFor500 = plan.pricePerStudentPerMonth * 500;
          const yearlyFor500 = monthlyFor500 * 12;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-500 dark:border-cyan-400 shadow-2xl scale-105 hover:scale-[1.08] hover:shadow-blue-500/30"
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:-translate-y-2"
              }`}
            >
              {plan.highlighted ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Best Value
                </div>
              ) : null}

              {plan.savingsLabel ? (
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md">
                  {plan.savingsLabel}
                </div>
              ) : null}

              <div className="text-center mt-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-blue-600 dark:text-cyan-400" : "text-gray-900 dark:text-white"}`}>
                  {plan.durationLabel}
                </h3>

                <div className="flex items-baseline justify-center mb-2">
                  {typeof plan.originalPricePerStudentPerMonth === "number" ? (
                    <span className="mr-3 text-lg font-semibold line-through text-gray-500 dark:text-gray-400">
                      ₹{plan.originalPricePerStudentPerMonth}
                    </span>
                  ) : null}

                  <span className={`text-5xl sm:text-6xl font-extrabold ${plan.highlighted ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent" : "text-gray-900 dark:text-white"}`}>
                    ₹{plan.pricePerStudentPerMonth}
                  </span>
                </div>

                <p className={`text-sm mb-6 font-medium ${plan.highlighted ? "text-blue-600 dark:text-cyan-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {plan.periodLabel}
                </p>

                <div className={`p-4 rounded-xl mb-6 border shadow-inner ${plan.highlighted ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700" : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 border-gray-200 dark:border-gray-600"}`}>
                  <p className="text-xs mb-1 text-gray-600 dark:text-gray-400 font-medium">For 500 students:</p>
                  <p className={`text-2xl font-bold ${plan.highlighted ? "text-blue-600 dark:text-cyan-400" : "text-gray-900 dark:text-white"}`}>
                    ₹{monthlyFor500.toLocaleString()}/month
                  </p>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Only ₹{yearlyFor500.toLocaleString()}/year</p>
                </div>

                <Link
                  href={
                    upgradeMode
                      ? `/subscription/payment?mode=upgrade&plan=${plan.id}`
                      : `/auth/register?plan=${plan.id}`
                  }
                  className="block"
                  onClick={() => {
                    if (upgradeMode) return;
                    setSelectedPlan(plan.id);
                  }}
                >
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.98] shadow-lg ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-blue-500/50 hover:shadow-2xl"
                        : "bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-900 dark:border-gray-600"
                    }`}
                  >
                    Choose {plan.durationLabel}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">6-Month free trial</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200/50 dark:border-purple-700/50">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">No setup fees</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">24 x 7 support guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}