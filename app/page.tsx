"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Calendar, Shield, Sparkles, Users, Zap, CheckCircle, TrendingUp, Award, Target } from "lucide-react";

import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import PricingCards from "@/components/pricing/PricingCards";
import dynamic from "next/dynamic";
const UpastithiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpastithiPageLoader").then(
      (m) => m.UpastithiPageLoader
    ),
  { ssr: false }
);

const AttendEaseLanding = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);


  useEffect(() => {
    const start = Date.now();
    const savedTheme = window.localStorage.getItem("Upastithi-theme");
    const initialIsDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(initialIsDark);
    document.documentElement.classList.toggle("dark", initialIsDark);

      const elapsed = Date.now() - start;
  const remaining = Math.max(1500 - elapsed, 0);

  const timer = setTimeout(() => {
    setMounted(true);
    setShowLoader(false);
  }, remaining);
  
  return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    window.localStorage.setItem("Upastithi-theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  if (showLoader) {
    return <UpastithiPageLoader />;
  }

  const features = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Smart Dashboard",
      description: "Intuitive interface designed for educators and administrators",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Low Friction",
      description: "Seamless attendance marking with bulk operations",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Comprehensive",
      description: "Complete school management in one powerful platform",
    },
  ];

  const testimonials = [
    {
      quote: "Upastithi has transformed how we manage attendance. What used to take hours now takes minutes. The real-time analytics help us identify students who need support immediately.",
      author: "Dr. Priya Sharma",
      role: "Principal, Delhi Public School",
      rating: 5,
      highlighted: false,
    },
    {
      quote: "The interface is so intuitive that our teachers were up and running within a day. No lengthy training needed. The mobile app is a game-changer for marking attendance on the go.",
      author: "Rajesh Kumar",
      role: "Academic Head, Mount Litera School",
      rating: 5,
      highlighted: true,
    },
    {
      quote: "We manage 5 branches with over 3,000 students. Upastithi's multi-school support and centralized dashboard give us complete visibility. Best investment we've made.",
      author: "Anita Desai",
      role: "Director, Greenwood High",
      rating: 5,
      highlighted: false,
    },
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
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/40 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 dark:bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "0s" }} />
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-400 dark:bg-blue-400 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-indigo-400 dark:bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: "2s" }} />
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
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300/40 to-blue-300/40 dark:from-purple-600/30 dark:to-blue-600/30 blur-3xl transform scale-110" />
              <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-6 shadow-2xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 dark:border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-900 dark:text-white mb-1">73%</div>
                    <div className="text-sm text-purple-700 dark:text-gray-400">Classroom Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 dark:border-blue-500/30">
                    <div className="text-3xl font-bold text-blue-900 dark:text-white mb-1">200+</div>
                    <div className="text-sm text-blue-700 dark:text-gray-400">Schools</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-indigo-600/20 backdrop-blur-sm rounded-2xl p-4 border border-indigo-200 dark:border-indigo-500/30">
                    <div className="text-3xl font-bold text-indigo-900 dark:text-white mb-1">203%</div>
                    <div className="text-sm text-indigo-700 dark:text-gray-400">Growth Rate</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-500/20 dark:to-pink-600/20 backdrop-blur-sm rounded-2xl p-4 border border-pink-200 dark:border-pink-500/30">
                    <div className="text-3xl font-bold text-pink-900 dark:text-white mb-1">38%</div>
                    <div className="text-sm text-pink-700 dark:text-gray-400">Engagement</div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="bg-gray-50 dark:bg-black/30 rounded-xl p-6 border border-gray-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 dark:text-white font-semibold">Today's Learning</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="h-32 bg-gradient-to-t from-purple-300 to-transparent dark:from-purple-500/30 dark:to-transparent rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-blue-300 to-transparent dark:from-blue-500/30 dark:to-transparent rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-pink-300 to-transparent dark:from-pink-500/30 dark:to-transparent rounded-lg" />
                  </div>
                  
                  {/* Student Images Placeholder */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-video bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg" />
                    <div className="aspect-video bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg" />
                    <div className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empower Institution Section */}
      <section className="relative py-20 px-4 sm:px-6 bg-white/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
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

      

      {/* Dashboard Showcase */}
      {/* <section className="relative py-20 px-4 sm:px-6 bg-white/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Revolutionize Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Innovative Management
              </span>{" "}
              Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience next-generation school management with our comprehensive dashboard
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/30 to-blue-300/30 dark:from-purple-600/20 dark:to-blue-600/20 blur-3xl" />
            <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
                    <div className="flex-1">
                      <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-purple-100 dark:bg-purple-800 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                    <div className="flex-1">
                      <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-blue-100 dark:bg-blue-800 rounded w-1/2" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-500/30">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">73%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                  </div>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-gray-700" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="314" strokeDashoffset="80" className="text-purple-500" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/30">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">78</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  </div>
                  <div className="p-4 bg-pink-50 dark:bg-pink-500/10 rounded-xl border border-pink-200 dark:border-pink-500/30">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">203</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Simplify Management Steps */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simplify School Management in{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                3 Steps
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Assignment</h3>
              <div className="space-y-4">
                {['Explore Features', 'Create Account', 'Navigate Dashboard', 'Optimize Workflow'].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Explore Features</h4>
                <p className="text-gray-600 dark:text-gray-400">Discover powerful tools designed to transform your school management experience.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Navigate Dashboard</h4>
                <p className="text-gray-600 dark:text-gray-400">Intuitive interface that makes managing your institution effortless and efficient.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Optimize Workflow</h4>
                <p className="text-gray-600 dark:text-gray-400">Streamline operations and boost productivity with automated processes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
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

      {/* Testimonials Section Commented Out*/}
      {/* Testimonials Section */}  
      {/* <section className="relative py-20 px-4 sm:px-6 bg-white/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Customer{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Feedback
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Hear from educators who transformed their institutions with Upastithi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  testimonial.highlighted
                    ? "bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-600/30 dark:to-blue-600/30 border-2 border-purple-300 dark:border-purple-500/50 shadow-2xl shadow-purple-200/50 dark:shadow-purple-500/20"
                    : "bg-white/80 dark:bg-gray-900/50 border border-gray-200/50 dark:border-white/10 shadow-lg"
                } backdrop-blur-xl`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 dark:from-purple-500 dark:to-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
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

      

      {/* FAQ Section */}
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

          <div className="space-y-4">
            {[
              {
                question: "Is there a free trial available?",
                answer: "Yes! We offer a 6-month free trial with full access to all features. No credit card required to start your trial.",
              },
              {
                question: "Can I upgrademy plan?",
                answer: "Absolutely. You can change your plan at any time. If you upgrade, you'll be charged the prorated difference.",
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data is yours. Before cancellation, you can export all your data in standard formats (CSV, PDF). We keep your data for 30 days after cancellation in case you change your mind.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      <MainFooter isDark={isDark} />
    </div>
  );
};

export default AttendEaseLanding;