"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import MainNavbar from "@/components/main/MainNavbar";
import MainFooter from "@/components/main/MainFooter";
import { Instagram, Linkedin, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import contactPageData from "./contact-page.json";

const UpastithiPageLoader = dynamic(
  () =>
    import("@/components/loader/UpastithiPageLoader").then(
      (m) => m.UpastithiPageLoader
    ),
  { ssr: false }
);

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
  const [showLoader, setShowLoader] = useState(true);

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
    const start = Date.now();
    const savedTheme = window.localStorage.getItem("Upastithi-theme");
    const initialIsDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(initialIsDark);
    document.documentElement.classList.toggle("dark", initialIsDark);

    const elapsed = Date.now() - start;
    const remaining = Math.max(500 - elapsed, 0);

    const timer = setTimeout(() => {
      setMounted(true);
      setShowLoader(false);
    }, remaining);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem("Upastithi-theme", next ? "dark" : "light");
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
      const sendPromise = (async () => {
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

        return true;
      })();

      toast.promise(sendPromise, {
        loading: "Sending message...",
        success: "Message sent successfully",
        error: (err) => (err instanceof Error ? err.message : "Failed to send message"),
      });

      await sendPromise;

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

  if (showLoader || !mounted) {
    return <UpastithiPageLoader />;
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
                      className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.name
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
                      className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.email
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
                      className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
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
                    className={`mt-1 w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-700 border text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.message
                        ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Tell us what you're looking for..."
                  />
                  {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message}</p> : null}
                </div>

                {status !== "idle" ? (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm border ${
                      status === "success"
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
                    <div className="text-gray-600 dark:text-gray-300">{contactPageData.quickContact.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Phone</div>
                    <div className="text-gray-600 dark:text-gray-300">{contactPageData.quickContact.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Location</div>
                    <div className="text-gray-600 dark:text-gray-300">{contactPageData.quickContact.location}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">Social</div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={contactPageData.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:shadow-md transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a
                    href={contactPageData.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:shadow-md transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href={contactPageData.socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:shadow-md transition-all"
                  >
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </a>
                </div>
              </div>

              <div className="mt-8 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <div className="font-bold text-gray-900 dark:text-white">Fast tip</div>
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