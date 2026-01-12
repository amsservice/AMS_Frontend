"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Calendar, Shield, Sparkles, Users, Zap } from "lucide-react";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import PricingCards from "@/components/pricing/PricingCards";

const AttendEaseLanding = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem("vidyarthii-theme");
    const initialIsDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(initialIsDark);
    document.documentElement.classList.toggle("dark", initialIsDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    window.localStorage.setItem("vidyarthii-theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-School Support",
      description:
        "Manage attendance across multiple schools from a single platform with unified data and custom configurations.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Role-Based Access",
      description: "Principals, teachers, and students each have tailored dashboards with appropriate permissions and views.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Attendance Marking",
      description: "Teachers can mark attendance in seconds with our intuitive interface. Support for bulk marking and quick edits.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Analytics",
      description: "Track attendance patterns, identify at-risk students, and generate comprehensive reports instantly.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with data encryption, audit logs and compliance with education data regulations.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built for speed with instant updates and real-time sync across all devices and users.",
    },
  ];

  const steps = [
    { num: "01", title: "Register School", desc: "Create your school account with principal credentials" },
    { num: "02", title: "Setup Classes", desc: "Create academic sessions and classes" },
    { num: "03", title: "Add Teachers", desc: "Invite teachers and assign them to classes" },
    { num: "04", title: "Start Tracking", desc: "Teachers mark attendance daily" },
  ];

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background Blur Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl bg-violet-500/20 dark:bg-violet-500/10" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl bg-cyan-500/20 dark:bg-cyan-500/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl bg-sky-500/20 dark:bg-sky-500/10" />
        <div className="absolute -bottom-28 -right-12 h-72 w-72 rounded-full blur-3xl bg-indigo-500/20 dark:bg-indigo-500/10" />
      </div>

      <MainNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 mx-auto w-fit bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <Zap className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trusted by 500+ Schools Across India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              Your Complete
              <span className="block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                  School Management
                </span>
              </span>
              <span className="block">Platform</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
              Transform the way you manage your school with our comprehensive platform. From attendance tracking to complete administrative control — everything you need in one powerful system.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-14 sm:mb-16">
              <Link href="/subscription/payment?plan=1Y">
                <button className="group px-7 sm:px-8 py-4 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90">
                  Register Your School
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </Link>

              <Link href="/auth/login">
                <button className="px-7 sm:px-8 py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg">
                  Login to Dashboard
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {[
                { value: "500+", label: "Schools" },
                { value: "50K+", label: "Students" },
                { value: "99.9%", label: "Uptime" },
                { value: "2M+", label: "Attendance Records" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              A complete school management solution designed for modern institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden p-7 sm:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              <span className="inline-flex items-center justify-center gap-3">
                <Sparkles className="w-7 h-7 text-blue-600 dark:text-cyan-400" />
                Pick your plan. Flex the savings.
              </span>
            </h2>
            <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
              Pay per student, lock a longer plan for bigger savings, and keep your school running smooth.
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">No setup fees. Cancel anytime. Taxes may apply.</p>
          </div>

          <PricingCards isDark={isDark} />

          <div className="rounded-3xl p-8 sm:p-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Everything Included in All Plans
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                No feature restrictions. Every plan gets full access to our complete platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {includedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl transition-all duration-300 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl shrink-0">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about Vidyarthii
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Is there a free trial available?",
                answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer:
                  "Absolutely. You can change your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the credit will be applied to your next billing cycle.",
              },
              {
                question: "What happens to my data if I cancel?",
                answer:
                  "Your data is yours. Before cancellation, you can export all your data in standard formats (CSV, PDF). We keep your data for 30 days after cancellation in case you change your mind.",
              },
              {
                question: "Do you offer training for teachers and staff?",
                answer:
                  "Yes! We provide comprehensive onboarding sessions, video tutorials, and documentation. Our support team is also available to help with any questions.",
              },
              {
                question: "Is my school's data secure?",
                answer:
                  "Security is our top priority. We use bank-level encryption, regular backups, and comply with all education data protection regulations. Your data is stored in secure servers in India.",
              },
              {
                question: "Can parents access attendance information?",
                answer:
                  "Yes, the parent portal (coming soon) will allow parents to view their child's attendance records, receive notifications for absences, and download reports.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6" id="contact">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl bg-cyan-500/20 dark:bg-cyan-500/10" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl bg-violet-500/20 dark:bg-violet-500/10" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Ready to Simplify School Management?
            </h2>
            <p className="text-base sm:text-lg mb-8 text-gray-600 dark:text-gray-300">
              Join hundreds of schools already using Vidyarthii to manage their operations effortlessly
            </p>
            <Link href="/subscription/payment?plan=1Y">
              <button className="px-9 sm:px-10 py-5 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90">
                Register Your School Today
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <MainFooter isDark={isDark} />
    </div>
  );
};

export default AttendEaseLanding;