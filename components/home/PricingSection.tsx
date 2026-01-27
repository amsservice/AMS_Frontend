"use client"
import PricingCards from '../pricing/PricingCards';

type Props = {
  isDark: boolean;
}

const PricingSection = ({ isDark }: Props) => {

  const includedFeatures = [
    { icon: "🎯", title: "Custom Reports", desc: "Generate reports tailored to your needs" },
    { icon: "📤", title: "Data Export", desc: "Export to CSV, Excel, PDF anytime" },
    { icon: "📊", title: "Advanced Analytics", desc: "Real-time insights and custom reports" },
    { icon: "🏫", title: "Multi-School Support", desc: "Manage multiple branches seamlessly" },
    { icon: "⚡", title: "Lightning Fast", desc: "99.9% uptime with instant sync" },
    { icon: "👥", title: "Role-Based Access", desc: "Custom permissions for every user" },
    { icon: "📧", title: "Priority Support", desc: "Email & chat support with quick response" },
    { icon: "📈", title: "Attendance Trends", desc: "Identify patterns and at-risk students" },
  ];

  return (
    <>
        {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                plan
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Find the perfect plan for your school</p>
          </div>

          <PricingCards isDark={isDark} />

          <div className="mt-12 rounded-3xl p-8 sm:p-12 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Everything Included in All Plans
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No feature restrictions. Full access to our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {includedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PricingSection