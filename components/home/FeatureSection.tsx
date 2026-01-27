"use client"

import Link from 'next/link'

const FeatureSection = () => {
    return (
        <>
            <section id="features" className="relative py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Institution, Elevate Student Success, and{" "}
                                <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                                    Streamline
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Comprehensive tools to track student progress, manage attendance, and generate actionable insights. Everything you need in one powerful platform.
                            </p>
                            <Link href="/auth/register">
                                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Explore More
                                </button>
                            </Link>
                        </div>

                        <div className="order-1 md:order-2 relative">
                            <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 shadow-2xl">
                                <div className="mb-4">
                                    <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">Learning Activity</h3>
                                    <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-500/30 flex items-end justify-around p-4">
                                        <div className="w-12 h-20 bg-purple-400 dark:bg-purple-500 rounded-t-lg" />
                                        <div className="w-12 h-32 bg-blue-400 dark:bg-blue-500 rounded-t-lg" />
                                        <div className="w-12 h-16 bg-indigo-400 dark:bg-indigo-500 rounded-t-lg" />
                                        <div className="w-12 h-28 bg-pink-400 dark:bg-pink-500 rounded-t-lg" />
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

export default FeatureSection