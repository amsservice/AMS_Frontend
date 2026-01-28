import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import DashboardPreviewSection from './DashboardPreviewSection'

const LandingPage = () => {
  return (
    <>
        <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-none">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trusted by 500+ Schools Across India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
              Powerful Tools for{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                Effective
              </span>
              <br />
              School Management.
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
              Streamline attendance, engage students, and empower teachers with our comprehensive school management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/register">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50 hover:shadow-purple-500/50 dark:hover:shadow-purple-500/70 transition-all duration-300 transform hover:scale-105">
                  Get Started
                  <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">→</span>
                </button>
              </Link>

              <Link href="/auth/login">
                <button className="px-8 py-4 bg-white dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-full font-semibold text-lg hover:bg-gray-50 dark:hover:bg-white/20 shadow-lg dark:shadow-none transition-all duration-300">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <DashboardPreviewSection/>
        </div>
      </section>
    </>
  )
}

export default LandingPage