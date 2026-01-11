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
      setStatusMessage("Thanks! We received your message. We’ll reach out soon.");
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
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

      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Let’s connect
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ask a question, request a demo, or get setup help. Send a message — we’ll get back quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white/80 backdrop-blur-sm shadow-xl dark:bg-white/5 dark:ring-white/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Name{required.name ? <span className="text-red-500"> *</span> : null}
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 ring-1 bg-white text-gray-900 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:ring-white/10 ${
                        errors.name
                          ? "ring-red-400 focus:ring-red-500/50"
                          : "ring-gray-200 focus:ring-indigo-500/60 dark:focus:ring-cyan-500/60"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email{required.email ? <span className="text-red-500"> *</span> : null}
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 ring-1 bg-white text-gray-900 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:ring-white/10 ${
                        errors.email
                          ? "ring-red-400 focus:ring-red-500/50"
                          : "ring-gray-200 focus:ring-indigo-500/60 dark:focus:ring-cyan-500/60"
                      }`}
                      placeholder="you@school.edu"
                      type="email"
                    />
                    {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 ring-1 bg-white text-gray-900 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:ring-white/10 ${
                        errors.phone
                          ? "ring-red-400 focus:ring-red-500/50"
                          : "ring-gray-200 focus:ring-indigo-500/60 dark:focus:ring-cyan-500/60"
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Subject
                    </label>
                    <input
                      value={form.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      className="mt-1 w-full rounded-xl px-4 py-3 ring-1 ring-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-cyan-500/60"
                      placeholder="Demo / Billing / Support"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Message{required.message ? <span className="text-red-500"> *</span> : null}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={6}
                    className={`mt-1 w-full rounded-xl px-4 py-3 ring-1 bg-white text-gray-900 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:ring-white/10 ${
                      errors.message
                        ? "ring-red-400 focus:ring-red-500/50"
                        : "ring-gray-200 focus:ring-indigo-500/60 dark:focus:ring-cyan-500/60"
                    }`}
                    placeholder="Tell us what you’re looking for..."
                  />
                  {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message}</p> : null}
                </div>

                {status !== "idle" ? (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ring-1 ${
                      status === "success"
                        ? "bg-emerald-500/10 ring-emerald-400/30 text-emerald-700 dark:text-emerald-200"
                        : "bg-rose-500/10 ring-rose-400/30 text-rose-700 dark:text-rose-200"
                    }`}
                  >
                    {statusMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 focus:ring-offset-white disabled:opacity-60 disabled:cursor-not-allowed dark:from-indigo-500 dark:via-sky-500 dark:to-cyan-500 dark:focus:ring-cyan-500/60 dark:focus:ring-offset-gray-950"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>

            <aside className="rounded-3xl p-6 sm:p-8 ring-1 ring-gray-200/70 bg-white shadow-xl dark:bg-white/5 dark:ring-white/10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick contact
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Prefer direct contact? Use the details below.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-indigo-600 dark:text-cyan-300 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email</div>
                    <div className="text-gray-600 dark:text-gray-300">support@vidyarthii.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 dark:text-cyan-300 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Phone</div>
                    <div className="text-gray-600 dark:text-gray-300">+91 98765 43210</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-cyan-300 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Location</div>
                    <div className="text-gray-600 dark:text-gray-300">Mumbai, India</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl p-4 ring-1 ring-gray-200/70 bg-white/60 dark:bg-white/5 dark:ring-white/10">
                <div className="font-medium text-gray-900 dark:text-white">Fast tip</div>
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Include your student count and preferred plan — we can give you an exact estimate.
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
