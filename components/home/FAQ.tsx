"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const FAQData = [
        {
            question: "Is there a free trial available?",
            answer: "Yes! We offer a 6-month free trial with full access to all features. No credit card required to start your trial.",
        },
        {
            question: "Can I upgrade my plan?",
            answer: "Absolutely. You can change your plan at any time. If you upgrade, you'll be charged the prorated difference.",
        },
        {
            question: "What happens to my data if I cancel?",
            answer: "Your data is yours. Before cancellation, you can export all your data in standard formats (CSV, PDF). We keep your data for 30 days after cancellation in case you change your mind.",
        },
        {
            question: "How many users can I add to my account?",
            answer: "The number of users depends on your plan. Our Basic plan supports up to 50 users, Professional up to 200 users, and Enterprise offers unlimited users.",
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We use bank-level 256-bit encryption, regular security audits, and comply with international data protection standards including GDPR and SOC 2.",
        },
    ]

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <>
            <section className="relative py-20 px-4 sm:px-6 bg-white/50 dark:bg-transparent">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Everything you need to know about Upastithi
                        </p>
                    </div>

                    <div className="space-y-3">
                        {FAQData.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-md hover:shadow-lg transition-all overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown
                                        className={`flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                                            openIndex === idx ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                
                                <div
                                    className={`transition-all duration-300 ease-in-out ${
                                        openIndex === idx
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    } overflow-hidden`}
                                >
                                    <div className="px-6 pb-5 pt-2">
                                        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default FAQ