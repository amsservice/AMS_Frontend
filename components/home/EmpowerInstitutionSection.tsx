"use client"

import Link from "next/link";

const EmpowerInstitutionSection = () => {
  return (
    <>
        <section className="relative py-20 sm:px-6 bg-white/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Empower Institution with Our{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Management Solutions
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Transform your educational institution with powerful tools designed for modern school administration. Track attendance, manage students, and generate insights effortlessly.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/register">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                    Learn More
                  </button>
                </Link>
                <button className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-white/20 transition-all">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30">
                    <span className="text-gray-900 dark:text-white font-medium">Student Strength</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">73%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30">
                    <span className="text-gray-900 dark:text-white font-medium">Budget Savings</span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">$2k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EmpowerInstitutionSection