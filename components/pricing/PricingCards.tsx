"use client";

import Link from "next/link";
import { PRICING_PLANS } from "@/lib/pricing";

type PricingCardsProps = {
  isDark: boolean;
};

export default function PricingCards({ isDark }: PricingCardsProps) {
  return (
    <div className="max-w-6xl mx-auto mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {PRICING_PLANS.map((plan) => {
          const monthlyFor500 = plan.pricePerStudentPerMonth * 500;
          const yearlyFor500 = monthlyFor500 * 12;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-500 dark:border-cyan-400 shadow-2xl scale-105 hover:scale-[1.07]"
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              }`}
            >
              {plan.highlighted ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  ⭐ Best Value
                </div>
              ) : null}

              {plan.savingsLabel ? (
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
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

                  <span className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white">
                    ₹{plan.pricePerStudentPerMonth}
                  </span>
                </div>

                <p className={`text-sm mb-6 ${plan.highlighted ? "text-blue-600 dark:text-cyan-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {plan.periodLabel}
                </p>

                <div className={`p-4 rounded-xl mb-6 ${plan.highlighted ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}>
                  <p className="text-xs mb-1 text-gray-600 dark:text-gray-400">For 500 students:</p>
                  <p className={`text-2xl font-bold ${plan.highlighted ? "text-blue-600 dark:text-cyan-400" : "text-gray-900 dark:text-white"}`}>
                    ₹{monthlyFor500}/month
                  </p>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Only ₹{yearlyFor500}/year</p>
                </div>

                <Link href={`/subscription/payment?plan=${plan.id}`} className="block">
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-lg ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:opacity-90"
                        : "bg-gray-900 dark:bg-white/10 text-white dark:text-white hover:bg-gray-800 dark:hover:bg-white/15 border border-gray-900 dark:border-white/20"
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

      <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">No setup fees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">Money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}