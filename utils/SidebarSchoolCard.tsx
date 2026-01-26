"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import InitialAvatar from "./base/InitialAvatar";

/* ================= TYPES ================= */

interface SidebarSchoolCardProps {
  schoolName?: string;
  schoolCode?: number;
}

/* ================= COMPONENT ================= */

const SidebarSchoolCard = memo(({
  schoolName = "St. Patrick's English High School",
  schoolCode = 9921,
}: SidebarSchoolCardProps) => {
  return (
    <motion.div
      // initial={{ opacity: 0, y: 8 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full px-4 py-2 mb-4"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0F0F10] border border-white/[0.1] shadow-2xl group">
        {/* Permanent Grain Texture */}
        <div className="absolute inset-0 opacity-[0.12] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

        {/* Permanent Top Edge Light */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

        {/* --- TOP SECTION: IDENTITY --- */}
        <div className="relative p-3 flex items-center gap-4 z-10">
          <div className="relative shrink-0">
            <div className="relative shrink-0 p-[1px] rounded-xl bg-gradient-to-b from-white/20 to-transparent shadow-2xl">
              <InitialAvatar label={schoolName} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-black mb-1 block">
              School
            </span>

            <h3
              className="text-base font-bold text-white truncate leading-none tracking-tight"
              title={schoolName}
            >
              {schoolName}
            </h3>
          </div>
        </div>

        {/* --- BOTTOM SECTION: THE CODE --- */}
        {schoolCode && (
          <div className="relative bg-black/60 border-t border-white/8 p-3">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(#fff 0.5px, transparent 0.5px)",
                backgroundSize: "10px 10px",
              }}
            />

            <div className="relative z-10 flex gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                  School Code
                </span>
              </div>

              <div className="relative w-fit">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-800/10 via-indigo-800/20 to-cyan-700/20 blur-3xl rounded-xl opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-blue-600/90 blur-xl rounded-full" />

                <div className="relative flex items-center justify-center-safe px-4 py-0.5 rounded-xl bg-white/[0.03] border border-blue-500/20 backdrop-blur-md">
                  <span className="font-mono text-2xl font-black text-white tracking-[0.15em] drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                    {schoolCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Setting display name is a best practice when using React.memo
SidebarSchoolCard.displayName = "SidebarSchoolCard";

export default SidebarSchoolCard;