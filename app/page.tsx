"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Calendar, Shield, Sparkles, Users, Zap, CheckCircle, TrendingUp, Award, Target } from "lucide-react";

import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import dynamic from "next/dynamic";
import PricingSection from "@/components/home/PricingSection";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import FeatureSection from "@/components/home/FeatureSection";
import SchoolManagementSection from "@/components/home/SchoolManagementSection";
import EmpowerInstitutionSection from "@/components/home/EmpowerInstitutionSection";
import LandingPage from "@/components/home/LandingPage";
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
      <LandingPage/>

      {/* Empower Institution Section */}
      <EmpowerInstitutionSection/>

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
      <SchoolManagementSection/>

      {/* Features Section */}
      <FeatureSection/>

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

      {/* Pricing Section  */}
      <PricingSection isDark={isDark}/>

      {/* FAQ Section */}
      <FAQ/>

      {/* CTA Section */}
      <CTA/>

      {/* Footer Section  */}
      <MainFooter isDark={isDark} />
    </div>
  );
};

export default AttendEaseLanding;