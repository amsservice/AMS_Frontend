"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkUploadModalProps {
  open: boolean;
  bulkTeacherFile: File | null;
  setBulkTeacherFile: (f: File | null) => void;
  bulkTeacherClientErrors: string[];
  resetBulkTeachersUpload: () => void;
  handleBulkTeacherUpload: () => void;
  isUploading: boolean;
  onClose: () => void;
  downloadSample: () => void;
}

export default function BulkUploadModal({
  open,
  bulkTeacherFile,
  setBulkTeacherFile,
  bulkTeacherClientErrors,
  resetBulkTeachersUpload,
  handleBulkTeacherUpload,
  isUploading,
  onClose,
  downloadSample,
}: BulkUploadModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            resetBulkTeachersUpload();
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bulk Upload Staff
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a CSV to create staff accounts
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetBulkTeachersUpload();
                  onClose();
                }}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Required columns: Name, Email, Password, Phone, Dob, Gender, Role <br />
                Optional: Highest Qualification, Experience Years, Address
              </p>
              <button
                onClick={downloadSample}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Sample CSV
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  setBulkTeacherFile(e.target.files?.[0] || null);
                }}
                className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-500 dark:hover:file:bg-blue-600 file:shadow-sm file:cursor-pointer cursor-pointer"
              />

              {bulkTeacherClientErrors.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-2">
                    Please fix the following issues in your CSV:
                  </p>
                  <div className="space-y-1">
                    {bulkTeacherClientErrors.slice(0, 12).map((msg) => (
                      <p
                        key={msg}
                        className="text-red-600 dark:text-red-400 text-xs"
                      >
                        {msg}
                      </p>
                    ))}
                    {bulkTeacherClientErrors.length > 12 && (
                      <p className="text-red-600 dark:text-red-400 text-xs">
                        And {bulkTeacherClientErrors.length - 12} more...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleBulkTeacherUpload}
                disabled={isUploading || !bulkTeacherFile}
                className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
              >
                {isUploading ? "Uploading..." : "Upload CSV"}
              </button>
              <Button
                variant="outline"
                onClick={() => {
                  resetBulkTeachersUpload();
                  onClose();
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
