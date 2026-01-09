"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Moon, Sun, CheckCircle, Users, BarChart3, Shield, Zap, Calendar  } from 'lucide-react';

const AttendEaseLanding = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-School Support",
      description: "Manage attendance across multiple schools from a single platform with unified data and custom configurations."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Role-Based Access",
      description: "Principals, teachers, and students each have tailored dashboards with appropriate permissions and views."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Attendance Marking",
      description: "Teachers can mark attendance in seconds with our intuitive interface. Support for bulk marking and quick edits."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Analytics",
      description: "Track attendance patterns, identify at-risk students, and generate comprehensive reports instantly."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with data encryption, audit logs and compliance with education data regulations."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built for speed with instant updates and real-time sync across all devices and users."
    }
  ];

  const steps = [
    { num: "01", title: "Register School", desc: "Create your school account with principal credentials" },
    { num: "02", title: "Setup Classes", desc: "Create academic sessions and classes" },
    { num: "03", title: "Add Teachers", desc: "Invite teachers and assign them to classes" },
    { num: "04", title: "Start Tracking", desc: "Teachers mark attendance daily" }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "per month",
      subtitle: "Perfect for getting started",
      features: [
        "Up to 50 students",
        "1 Teacher account",
        "Basic attendance tracking",
        "Email support"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "₹999",
      period: "per month",
      subtitle: "For growing schools",
      features: [
        "Up to 500 students",
        "Unlimited teachers",
        "Advanced analytics",
        "Priority support",
        "Custom reports"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      subtitle: "For large institutions",
      features: [
        "Unlimited students",
        "Unlimited teachers",
        "Dedicated support",
        "API access",
        "Custom integrations",
        "SLA guarantee"
      ],
      highlighted: false
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-sm border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>AttendEase</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Features</a>
              <a href="#pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Pricing</a>
              <a href="#contact" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <Link href='/auth/login'>
                <button className={`px-4 py-2 rounded-lg transition ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Login
                </button></Link>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition transform hover:scale-105 shadow-lg shadow-blue-500/30">
                Register School
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 mx-auto block w-fit ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
            <Zap className="w-4 h-4 text-blue-600" />
            <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Trusted by 500+ Schools Across India</span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Attendance Management<br />
              <span className="text-blue-600">Made Simple</span>
            </h1>
            <p className={`text-xl mb-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Streamline your school's attendance tracking with our powerful SaaS platform. From registration to daily marking — everything in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/subscription/payment">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition transform hover:scale-105 shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-2">
                  Register Your School
                  <span>→</span>
                </button>
              </Link>
              <Link href="/auth/login">
              <button className={`px-8 py-4 rounded-xl font-semibold text-lg transition transform hover:scale-105 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200'}`}>
                Login to Dashboard
              </button></Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: "500+", label: "Schools" },
                { value: "50K+", label: "Students" },
                { value: "99.9%", label: "Uptime" },
                { value: "2M+", label: "Attendance Records" }
              ].map((stat, idx) => (
                <div key={idx} className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:shadow-xl'}`}>
                  <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              A complete attendance management solution designed for modern schools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group ${isDark
                    ? 'bg-gray-800/50 hover:bg-gray-800 hover:shadow-2xl hover:shadow-blue-500/20'
                    : 'bg-white hover:shadow-2xl hover:shadow-blue-500/10'
                  }`}
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white shadow-lg shadow-blue-500/50">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Get Started in Minutes
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Simple setup process to get your school up and running
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-xl shadow-blue-500/50 group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`hidden md:block absolute top-1/2 left-[60%] w-[80%] h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Start free and scale as your school grows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 transition-all duration-300 ${plan.highlighted
                    ? 'bg-blue-600 text-white scale-105 shadow-2xl shadow-blue-500/50 transform hover:scale-110'
                    : isDark
                      ? 'bg-gray-800/50 hover:bg-gray-800 hover:shadow-xl'
                      : 'bg-white hover:shadow-2xl'
                  } ${!plan.highlighted && 'hover:scale-105'}`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-2 ${plan.highlighted ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mb-6 ${plan.highlighted ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.subtitle}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.highlighted ? 'text-blue-50' : isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                      : isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                    }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className={`max-w-5xl mx-auto rounded-3xl p-12 text-center ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ready to Simplify Attendance?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join hundreds of schools already using AttendEase to manage their attendance effortlessly
          </p>
          <button className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition transform hover:scale-105 shadow-2xl shadow-blue-500/50 flex items-center justify-center gap-2 mx-auto">
            Register Your School Today
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>AttendEase</span>
              </div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Making attendance management simple and efficient for schools across India.
              </p>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product</h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-blue-600 transition">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Login</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Support</h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>support@attendease.com</li>
                <li>+91 98765 43210</li>
                <li>Mumbai, India</li>
              </ul>
            </div>
          </div>

          <div className={`border-t pt-8 text-center ${isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
            <p>© 2025 AttendEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendEaseLanding;