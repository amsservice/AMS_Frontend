"use client"

import Link from "next/link";

const CTA = () => {
    return (
        <>
            <section className="relative py-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-3xl p-12 text-center overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-600/20 dark:to-blue-600/20 backdrop-blur-xl border border-purple-200 dark:border-white/10 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-blue-200/30 dark:from-purple-600/10 dark:to-blue-600/10 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                It's easy to get started
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join hundreds of schools using Upastithi to transform their operations
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/register">
                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50 hover:shadow-purple-500/50 dark:hover:shadow-purple-500/70 transition-all duration-300 transform hover:scale-105">
                                        Create Account
                                    </button>
                                </Link>
                                <button className="px-8 py-4 bg-white dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-white/20 shadow-lg dark:shadow-none transition-all duration-300">
                                    Watch Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CTA