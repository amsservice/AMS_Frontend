import React from 'react';

interface InitialAvatarProps {
  label: string;
  className?: string;
}

const InitialAvatar = ({ label, className = "" }: InitialAvatarProps) => {
  const firstLetter = label?.charAt(0) || "?";

  return (
    <div className={`relative shrink-0 p-[1px] rounded-xl bg-gradient-to-b from-white/20 to-transparent shadow-2xl ${className}`}>
      {/* Main Square Container */}
      <div className="w-12 h-12 rounded-[11px] bg-[#0A0A0B] relative overflow-hidden flex items-center justify-center border border-white/5">
        
        {/* 1. The "Glass Reflection" (Diagonal shine) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-white/[0.05] to-transparent pointer-events-none" />

        {/* 2. Inner Shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] rounded-[11px]" />

        {/* 3. The Letter with a "Silver/Metallic" finish */}
        <span className="relative z-10 text-xl font-black bg-gradient-to-b from-white via-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
          {firstLetter}
        </span>

        {/* 4. Bottom Highlight (Internal "Glow") */}
        <div className="absolute -bottom-2 inset-x-0 h-4 bg-blue-500/10 blur-md rounded-full" />
        
        {/* 5. Subtle Top Edge Lighting */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
};

export default InitialAvatar;