"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ClassItem {
  id: string;
  name: string;
  section: string;
  sessionId: string;
  teacherId?: string | null;
}

interface SwapClassModalProps {
  open: boolean;
  classes: ClassItem[];
  selectedClassId: string;
  setSelectedClassId: (v: string) => void;
  currentClassId: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function SwapClassModal({
  open,
  classes,
  selectedClassId,
  setSelectedClassId,
  currentClassId,
  onConfirm,
  onClose,
}: SwapClassModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Swap/Change Class
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select an available class for this teacher.
            </p>

            <select
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white mb-4"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option
                  key={`${cls.id}-${cls.sessionId}`}
                  value={cls.id}
                  disabled={
                    !!cls.teacherId ||
                    (currentClassId ? cls.id === currentClassId : false)
                  }
                >
                  {cls.name} - {cls.section}
                  {currentClassId && cls.id === currentClassId
                    ? " (Current)"
                    : cls.teacherId
                    ? " (Occupied)"
                    : " (Available)"}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                disabled={!selectedClassId}
                onClick={onConfirm}
              >
                Confirm
              </button>
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
