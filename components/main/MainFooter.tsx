"use client";

import { Calendar } from "lucide-react";

type MainFooterProps = {
  isDark: boolean;
};

export default function MainFooter({ isDark }: MainFooterProps) {
  return (
    <footer className={`py-12 px-4 sm:px-6 border-t ${isDark ? "bg-gray-950 border-white/10" : "bg-white border-gray-200/70"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ring-1 ${
                  isDark
                    ? "bg-linear-to-br from-indigo-400/25 via-sky-400/20 to-cyan-300/20 ring-white/10"
                    : "bg-linear-to-br from-indigo-600 via-sky-600 to-cyan-500 ring-black/5"
                }`}
              >
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Vidyarthii</span>
                <span className={`hidden sm:block text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  School management, simplified
                </span>
              </div>
            </div>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Making school management simple and efficient for institutions across India.
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Product</h4>
            <ul className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              <li>
                <a href="#features" className="hover:text-blue-600 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blue-600 transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/auth/login" className="hover:text-blue-600 transition">
                  Login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Support</h4>
            <ul className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              <li>
                <a href="#" className="hover:text-blue-600 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Contact</h4>
            <ul className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              <li>support@vidyarthii.com</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className={`border-t pt-8 text-center ${isDark ? "border-white/10 text-gray-400" : "border-gray-200/70 text-gray-600"}`}>
          <p>&copy; 2025 Vidyarthii. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
