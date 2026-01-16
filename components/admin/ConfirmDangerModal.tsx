"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmText?: string;
  confirmTextLabel?: string;
  dangerLevel?: "medium" | "high";
  confirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmDangerModal({
  open,
  title,
  description,
  confirmLabel,
  confirmText,
  confirmTextLabel,
  dangerLevel = "high",
  confirmDisabled,
  onClose,
  onConfirm,
}: Props) {
  const [typed, setTyped] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTyped("");
      setSubmitting(false);
    }
  }, [open]);

  const requiresText = !!confirmText;
  const isMatch = useMemo(() => {
    if (!requiresText) return true;
    return typed.trim() === confirmText;
  }, [requiresText, typed, confirmText]);

  const canConfirm = !submitting && isMatch && !confirmDisabled;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={() => {
              if (!submitting) onClose();
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
                        dangerLevel === "high"
                          ? "bg-gradient-to-br from-red-500 to-orange-500"
                          : "bg-gradient-to-br from-amber-500 to-orange-500"
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{title}</div>
                      <div className="mt-1 text-sm text-gray-300 leading-relaxed">
                        {description}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!submitting) onClose();
                    }}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {requiresText ? (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-gray-200">
                      {confirmTextLabel || "Type to confirm"}
                    </div>
                    <input
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder={confirmText}
                      disabled={submitting}
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      Type <span className="font-semibold text-white">{confirmText}</span> to enable the action.
                    </div>
                  </div>
                ) : null}

                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!submitting) onClose();
                    }}
                    disabled={submitting}
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                    type="button"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={!canConfirm}
                    onClick={async () => {
                      try {
                        setSubmitting(true);
                        await onConfirm();
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    type="button"
                  >
                    {submitting ? "Working..." : confirmLabel}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
