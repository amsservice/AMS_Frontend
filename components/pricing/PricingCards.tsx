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
                  ? isDark
                    ? "bg-linear-to-br from-indigo-500/10 via-sky-500/10 to-cyan-500/10 ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/20 scale-105 hover:scale-[1.07]"
                    : "bg-linear-to-br from-indigo-50 via-sky-50 to-cyan-50 ring-2 ring-indigo-400/50 shadow-2xl shadow-indigo-500/20 scale-105 hover:scale-[1.07]"
                  : isDark
                    ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/7 hover:shadow-xl hover:-translate-y-1"
                    : "bg-white ring-1 ring-gray-200 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {plan.highlighted ? (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-lg ${
                    isDark
                      ? "bg-linear-to-r from-cyan-500 to-indigo-500 text-white"
                      : "bg-linear-to-r from-indigo-600 to-cyan-500 text-white"
                  }`}
                >
                  ⭐ Best Value
                </div>
              ) : null}

              {plan.savingsLabel ? (
                <div
                  className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold ${
                    isDark
                      ? plan.highlighted
                        ? "bg-green-400/30 text-green-200 ring-1 ring-green-400/40"
                        : "bg-green-500/20 text-green-300 ring-1 ring-green-500/30"
                      : plan.highlighted
                        ? "bg-green-200 text-green-800 ring-1 ring-green-300"
                        : "bg-green-100 text-green-700 ring-1 ring-green-200"
                  }`}
                >
                  {plan.savingsLabel}
                </div>
              ) : null}

              <div className="text-center mt-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlighted
                      ? isDark
                        ? "text-cyan-300"
                        : "text-indigo-700"
                      : isDark
                        ? "text-white"
                        : "text-gray-900"
                  }`}
                >
                  {plan.durationLabel}
                </h3>

                <div className="flex items-baseline justify-center mb-2">
                  {typeof plan.originalPricePerStudentPerMonth === "number" ? (
                    <span className={`mr-3 text-lg font-semibold line-through ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      ₹{plan.originalPricePerStudentPerMonth}
                    </span>
                  ) : null}

                  <span
                    className={`text-5xl sm:text-6xl font-extrabold ${
                      plan.highlighted
                        ? isDark
                          ? "text-white"
                          : "text-gray-900"
                        : isDark
                          ? "text-white"
                          : "text-gray-900"
                    }`}
                  >
                    ₹{plan.pricePerStudentPerMonth}
                  </span>
                </div>

                <p
                  className={`text-sm mb-6 ${
                    plan.highlighted
                      ? isDark
                        ? "text-cyan-200"
                        : "text-indigo-600"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-600"
                  }`}
                >
                  {plan.periodLabel}
                </p>

                <div
                  className={`p-4 rounded-2xl mb-6 ${
                    plan.highlighted
                      ? isDark
                        ? "bg-white/5"
                        : "bg-white/60"
                      : isDark
                        ? "bg-white/5"
                        : "bg-gray-50"
                  }`}
                >
                  <p className={`text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>For 500 students:</p>
                  <p
                    className={`text-2xl font-bold ${
                      plan.highlighted
                        ? isDark
                          ? "text-cyan-300"
                          : "text-indigo-700"
                        : isDark
                          ? "text-white"
                          : "text-gray-900"
                    }`}
                  >
                    ₹{monthlyFor500}/month
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Only ₹{yearlyFor500}/year</p>
                </div>

                <Link href={`/subscription/payment?plan=${plan.id}`} className="block">
                  <button
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg ${
                      plan.highlighted
                        ? isDark
                          ? "bg-linear-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400 shadow-cyan-500/30 focus:ring-cyan-500 focus:ring-offset-gray-950"
                          : "bg-linear-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-500/30 focus:ring-indigo-500 focus:ring-offset-white"
                        : isDark
                          ? "bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/20 focus:ring-white/50 focus:ring-offset-gray-950"
                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 focus:ring-offset-white"
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

      <div className={`text-center p-6 rounded-2xl ${isDark ? "bg-white/5 ring-1 ring-white/10" : "bg-gray-50 ring-1 ring-gray-200"}`}>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>No setup fees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
