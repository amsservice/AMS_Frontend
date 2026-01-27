"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeacherLite {
  id: string;
  name: string;
  currentClass?: {
    classId: string;
    className: string;
    section: string;
  };
}

interface DeleteConfirmModalProps {
  confirmDelete: { id: string; name: string } | null;
  teacherToDelete?: TeacherLite;
  unassignedTeachers: TeacherLite[];
  showReassignOnDelete: boolean;
  setShowReassignOnDelete: (v: boolean) => void;
  reassignToTeacherId: string;
  setReassignToTeacherId: (v: string) => void;
  isReassigning: boolean;
  onClose: () => void;
  onDeleteDirect: (id: string) => void;
  onReassignAndDelete: () => void;
}

export default function DeleteConfirmModal({
  confirmDelete,
  teacherToDelete,
  unassignedTeachers,
  showReassignOnDelete,
  setShowReassignOnDelete,
  reassignToTeacherId,
  setReassignToTeacherId,
  isReassigning,
  onClose,
  onDeleteDirect,
  onReassignAndDelete,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {confirmDelete && (
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
                Delete Teacher
              </h3>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Are you sure you want to remove this teacher? This will mark the
              teacher as inactive.
              <span className="font-semibold text-gray-900 dark:text-white">
                {" "}
                {confirmDelete.name}
              </span>
            </p>

            {teacherToDelete?.currentClass && (
              <div className="mb-5">
                {!showReassignOnDelete ? (
                  <button
                    onClick={() => setShowReassignOnDelete(true)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm"
                  >
                    Reassign class to another teacher
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Reassign Class {teacherToDelete.currentClass.className} - {" "}
                      {teacherToDelete.currentClass.section}
                    </p>

                    <select
                      value={reassignToTeacherId}
                      onChange={(e) => setReassignToTeacherId(e.target.value)}
                      className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-3 text-sm"
                    >
                      <option value="">Select unassigned teacher</option>
                      {unassignedTeachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    {unassignedTeachers.length === 0 && (
                      <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
                        No unassigned teachers available.
                      </p>
                    )}

                    <div className="flex gap-3 justify-end mt-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowReassignOnDelete(false);
                          setReassignToTeacherId("");
                        }}
                        className="rounded-xl"
                      >
                        Back
                      </Button>
                      <button
                        onClick={onReassignAndDelete}
                        disabled={
                          isReassigning ||
                          !reassignToTeacherId ||
                          unassignedTeachers.length === 0
                        }
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
                      >
                        {isReassigning ? "Reassigning..." : "Reassign & Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>

              {!showReassignOnDelete && (
                <button
                  onClick={() => onDeleteDirect(confirmDelete.id)}
                  disabled={isReassigning}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                  Yes, Delete
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
