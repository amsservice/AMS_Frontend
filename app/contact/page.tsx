"use client";

import { useEffect, useMemo, useState } from "react";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import { Mail, Phone, MapPin, Send } from "lucide-react";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactForm, string>>;

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export default function ContactPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

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
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("vidyarthii-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const required = useMemo(
    () => ({
      name: true,
      email: true,
      message: true,
      phone: false,
      subject: false,
    }),
    []
  );

  const validate = (next: ContactForm) => {
    const nextErrors: FieldErrors = {};

    if (!next.name.trim() || next.name.trim().length < 2) {
      nextErrors.name = "Please enter your name (min 2 characters).";
    }

    if (!next.email.trim() || !isValidEmail(next.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (next.phone.trim() && next.phone.trim().length < 10) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!next.message.trim() || next.message.trim().length < 10) {
      nextErrors.message = "Please write a message (min 10 characters).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    key: keyof ContactForm,
    value: string
  ) => {
    setStatus("idle");
    setStatusMessage("");
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    };

    if (!validate(next)) return;

    setSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: next.name.trim(),
          email: next.email.trim(),
          phone: next.phone.trim() || undefined,
          subject: next.subject.trim() || undefined,
          message: next.message.trim(),
        }),
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        const message =
          typeof data === "object" && data !== null && "message" in data
            ? String((data as { message: unknown }).message)
            : "Failed to send message";
        throw new Error(message);
      }

      setStatus("success");
      setStatusMessage("Thanks! We received your message. We'll reach out soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch (err: unknown) {
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-black overflow-hidden">
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

      <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Let's connect
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ask a question, request a demo, or get setup help. Send a message — we'll get back quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name{required.name ? <span className="text-red-500"> *</span> : null}
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.name
                          ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      placeholder="Your name"
                    />
                    {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email{required.email ? <span className="text-red-500"> *</span> : null}
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                          ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      placeholder="you@school.edu"
                      type="email"
                    />
                    {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.phone
                          ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <input
                      value={form.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      className="mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Demo / Billing / Support"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message{required.message ? <span className="text-red-500"> *</span> : null}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={6}
                    className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.message
                        ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    placeholder="Tell us what you're looking for..."
                  />
                  {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message}</p> : null}
                </div>

                {status !== "idle" ? (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm border ${status === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                      }`}
                  >
                    {statusMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>

            <aside className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Quick contact
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Prefer direct contact? Use the details below.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Email</div>
                    <div className="text-gray-600 dark:text-gray-300">ams.service.hub@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Phone</div>
                    <div className="text-gray-600 dark:text-gray-300">+91 7352675671 / +91 7857847749</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Location</div>
                    <div className="text-gray-600 dark:text-gray-300">Ranchi, India</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <div className="font-bold text-gray-900 dark:text-white">Fast tip</div>
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Include your student count and preferred plan — we can give you an exact estimate.
                </div>
              </div>

              <div className="mt-6">
                <div className="font-bold text-gray-900 dark:text-white mb-3">Follow us</div>
                <div className="flex gap-3 flex-wrap">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-cyan-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-cyan-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-cyan-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-cyan-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-cyan-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <MainFooter isDark={isDark} />
    </div>
  );
}