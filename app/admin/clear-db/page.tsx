"use client";

import { motion } from "framer-motion";
import { Database, Shield } from "lucide-react";
import ClearDbPanel from "@/components/admin/ClearDbPanel";

export default function ClearDbPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">ClearDB</div>
            <div className="text-sm text-gray-300">
              High-impact tools. Always double-check before applying destructive actions.
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-300">
            <Shield className="w-4 h-4" />
            Principal only
          </div>
        </div>
      </motion.div>

      <ClearDbPanel title="Clear Database" />
    </div>
  );
}
