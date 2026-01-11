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
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <div className="text-sm text-gray-500">Loading...</div>
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
    { icon: "✨", title: "Unlimited Access", desc: "No limits on students, teachers, or classes" },
    { icon: "📊", title: "Advanced Analytics", desc: "Real-time insights and custom reports" },
    { icon: "🔒", title: "Bank-Level Security", desc: "Enterprise encryption & daily backups" },
    { icon: "🏫", title: "Multi-School Support", desc: "Manage multiple branches seamlessly" },
    { icon: "📱", title: "Mobile Apps", desc: "iOS & Android apps for on-the-go access" },
    { icon: "⚡", title: "Lightning Fast", desc: "99.9% uptime with instant sync" },
    { icon: "👥", title: "Role-Based Access", desc: "Custom permissions for every user" },
    { icon: "📧", title: "Priority Support", desc: "Email & chat support with quick response" },
    { icon: "📤", title: "Data Export", desc: "Export to CSV, Excel, PDF anytime" },
    { icon: "🔄", title: "Auto Backups", desc: "Your data is safe and recoverable" },
    { icon: "📈", title: "Attendance Trends", desc: "Identify patterns and at-risk students" },
    { icon: "🎯", title: "Custom Reports", desc: "Generate reports tailored to your needs" },
  ];

  const featureCardLightGradients = [
    "bg-linear-to-br from-white via-indigo-50 to-sky-50",
    "bg-linear-to-br from-white via-emerald-50 to-cyan-50",
    "bg-linear-to-br from-white via-amber-50 to-rose-50",
    "bg-linear-to-br from-white via-violet-50 to-fuchsia-50",
    "bg-linear-to-br from-white via-sky-50 to-cyan-50",
    "bg-linear-to-br from-white via-slate-50 to-indigo-50",
  ];

  return (
    <div
      className={`relative isolate min-h-screen transition-colors duration-300 ${
        isDark ? "bg-linear-to-b from-slate-950 via-slate-950 to-slate-900" : "bg-linear-to-b from-white via-slate-50 to-slate-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl ${isDark ? "bg-violet-500/8" : "bg-violet-500/14"}`} />
        <div className={`absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl ${isDark ? "bg-cyan-500/10" : "bg-cyan-500/16"}`} />
        <div className={`absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl ${isDark ? "bg-sky-500/10" : "bg-sky-500/14"}`} />
        <div className={`absolute -bottom-28 -right-12 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-indigo-500/10" : "bg-indigo-500/12"}`} />
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

      <section className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 mx-auto w-fit border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-cyan-100' : 'bg-white/70 border-slate-200 text-slate-700'} animate-in fade-in duration-700`}>
              <Zap className={`w-4 h-4 ${isDark ? 'text-cyan-300' : 'text-blue-600'}`} />
              <span className="text-sm font-medium">Trusted by 500+ Schools Across India</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'} animate-in fade-in slide-in-from-bottom-2 duration-700`}>
              Your Complete
              <span className="block">
                <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-200 via-sky-200 to-cyan-200' : 'bg-gradient-to-r from-indigo-700 via-sky-600 to-cyan-600'}`}>School Management</span>
              </span>
              <span className="block">Platform</span>
            </h1>

            <p className={`text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150`}>
              Transform the way you manage your school with our comprehensive platform. From attendance tracking to complete administrative control — everything you need in one powerful system.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-14 sm:mb-16 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              <Link href="/subscription/payment?plan=1Y">
                <button
                  className={`group px-7 sm:px-8 py-4 text-white rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 ${
                    isDark
                      ? "bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-500 shadow-sky-500/25 focus:ring-offset-gray-950"
                      : "bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 shadow-sky-500/30 focus:ring-offset-white"
                  }`}
                >
                  Register Your School
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </Link>

              <Link href="/auth/login">
                <button
                  className={`px-7 sm:px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 text-white ring-1 ring-white/10 focus:ring-offset-gray-950"
                      : "bg-white/80 hover:bg-white text-slate-900 border border-slate-200 focus:ring-offset-white"
                  }`}
                >
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
                  className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 ${
                    isDark ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/7 hover:shadow-blue-500/10" : "bg-white ring-1 ring-gray-200/70 hover:shadow-blue-500/10"
                  }`}
                >
                  <div className={`text-2xl sm:text-3xl font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{stat.value}</div>
                  <div className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Everything You Need</h2>
            <p className={`text-base sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>A complete school management solution designed for modern institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden p-7 sm:p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 group ${
                  isDark
                    ? "bg-linear-to-br from-white/6 via-white/3 to-indigo-500/8 ring-1 ring-white/10 hover:shadow-2xl hover:shadow-indigo-500/10"
                    : `${featureCardLightGradients[idx % featureCardLightGradients.length]} ring-1 ring-gray-200/70 hover:shadow-2xl hover:shadow-indigo-500/10`
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark ? "bg-linear-to-br from-cyan-500/10 via-transparent to-indigo-500/10" : "bg-linear-to-br from-cyan-100/40 via-transparent to-indigo-100/40"
                  }`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-lg ring-1 ${
                      isDark ? "bg-white/5 text-cyan-200 ring-white/10 shadow-black/20" : "bg-slate-900/5 text-indigo-700 ring-slate-200/70 shadow-slate-900/5"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{feature.title}</h3>
                  <p className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Loved by Schools Nationwide</h2>
            <p className={`text-base sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>See what principals and teachers are saying about Vidyarthii</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Vidyarthii has transformed how we manage attendance. What used to take hours now takes minutes. The real-time analytics help us identify students who need support immediately.",
                author: "Dr. Priya Sharma",
                role: "Principal, Delhi Public School",
                rating: 5,
              },
              {
                quote:
                  "The interface is so intuitive that our teachers were up and running within a day. No lengthy training needed. The mobile app is a game-changer for marking attendance on the go.",
                author: "Rajesh Kumar",
                role: "Academic Head, Mount Litera School",
                rating: 5,
              },
              {
                quote:
                  "We manage 5 branches with over 3,000 students. Vidyarthii's multi-school support and centralized dashboard give us complete visibility. Best investment we've made.",
                author: "Anita Desai",
                role: "Director, Greenwood High",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl transition-all duration-300 ${
                  isDark ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/7" : "bg-white ring-1 ring-gray-200/70 hover:shadow-xl"
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${isDark ? "text-yellow-400" : "text-yellow-500"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={`mb-6 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{testimonial.author}</div>
                  <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              <span className={`inline-flex items-center justify-center gap-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                <Sparkles className={`w-7 h-7 ${isDark ? "text-cyan-300" : "text-indigo-600"}`} />
                Pick your plan. Flex the savings.
              </span>
            </h2>
            <p className={`text-base sm:text-lg max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Pay per student, lock a longer plan for bigger savings, and keep your school running smooth.
            </p>
            <p className={`mt-3 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>No setup fees. Cancel anytime. Taxes may apply.</p>
          </div>

          <PricingCards isDark={isDark} />

          <div
            className={`rounded-3xl p-8 sm:p-12 ${
              isDark ? "bg-linear-to-br from-slate-900/50 to-slate-800/50 ring-1 ring-white/10" : "bg-linear-to-br from-white to-gray-50 ring-1 ring-gray-200 shadow-xl"
            }`}
          >
            <div className="text-center mb-10">
              <h3 className={`text-2xl sm:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Everything Included in All Plans</h3>
              <p className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>No feature restrictions. Every plan gets full access to our complete platform.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {includedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl transition-all duration-300 ${
                    isDark ? "bg-white/5 hover:bg-white/10 ring-1 ring-white/10" : "bg-white hover:bg-gray-50 ring-1 ring-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl shrink-0">{feature.icon}</span>
                    <div>
                      <h4 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{feature.title}</h4>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Frequently Asked Questions</h2>
            <p className={`text-base sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>Everything you need to know about Vidyarthii</p>
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
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  isDark ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/7" : "bg-white ring-1 ring-gray-200/70 hover:shadow-lg"
                }`}
              >
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{faq.question}</h3>
                <p className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" id="contact">
        <div
          className={`max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden ${
            isDark
              ? "bg-linear-to-br from-slate-900 via-slate-950 to-slate-950 ring-1 ring-white/10"
              : "bg-linear-to-br from-white via-indigo-50 to-cyan-50 ring-1 ring-slate-200/60"
          }`}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl ${isDark ? "bg-cyan-500/12" : "bg-cyan-500/12"}`} />
            <div className={`absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl ${isDark ? "bg-violet-500/10" : "bg-violet-500/10"}`} />
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Ready to Simplify School Management?
          </h2>
          <p className={`text-base sm:text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Join hundreds of schools already using Vidyarthii to manage their operations effortlessly
          </p>
          <Link href="/subscription/payment?plan=1Y">
            <button
              className={`px-9 sm:px-10 py-5 text-white rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 ${
                isDark
                  ? "bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-500 shadow-sky-500/25 focus:ring-offset-gray-950"
                  : "bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 shadow-sky-500/30 focus:ring-offset-white"
              }`}
            >
              Register Your School Today
              <span>→</span>
            </button>
          </Link>
        </div>
      </section>

      <MainFooter isDark={isDark} />
    </div>
  );
};

export default AttendEaseLanding;