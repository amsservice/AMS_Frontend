"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReactivateModalProps {
  confirmReactivate: { id: string; email: string } | null;
  isReactivating: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function ReactivateModal({
  confirmReactivate,
  isReactivating,
  onClose,
  onConfirm,
}: ReactivateModalProps) {
  return (
    <AnimatePresence>
      {confirmReactivate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Reactivate Teacher
              </h3>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              This email already exists with inactive status.
              <span className="font-semibold text-gray-900 dark:text-white">
                {" "}
                {confirmReactivate.email}
              </span>
              . Would you like to make this teacher active?
            </p>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                No
              </Button>
              <button
                onClick={() => onConfirm(confirmReactivate.id)}
                disabled={isReactivating}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                {isReactivating ? "Activating..." : "Yes, Activate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
