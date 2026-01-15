import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const UpasthitiPageLoader = () => {

    // const [darkMode, setDarkMode] = useState(false);

    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-8 bg-white dark:bg-black">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Rotating rings - subtle colors */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${120 + i * 20}px`,
                height: `${120 + i * 20}px`,
                border: '3px solid transparent',
                borderTopColor: i === 0 ? '#a855f7' : i === 1 ? '#6366f1' : '#3b82f6',
                borderRightColor: i === 0 ? '#8b5cf6' : i === 1 ? '#818cf8' : '#60a5fa',
                boxShadow: `0 0 15px ${i === 0 ? 'rgba(168, 85, 247, 0.3)' : i === 1 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360
              }}
              // initial={false}
              transition={{
                duration: 3 - i * 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Center glassmorphism card */}
          <motion.div
            className="relative z-10 px-8 py-6 rounded-2xl
           bg-white/90 dark:bg-purple-500/10
           backdrop-blur-[20px]
           border-2 border-purple-400/30
           shadow-[0_8px_32px_rgba(139,92,246,0.25)]"
            animate={{
              y: [0, -12, 0],
              boxShadow: [
                '0 8px 32px rgba(139, 92, 246, 0.25)',
                '0 12px 48px rgba(99, 102, 241, 0.35)',
                '0 8px 32px rgba(139, 92, 246, 0.25)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            // initial={false}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              UPASTHITI
            </div>
          </motion.div>

          {/* Floating particles - smaller */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#6366f1' : '#3b82f6',
                boxShadow: `0 0 8px ${i % 3 === 0 ? 'rgba(168, 85, 247, 0.4)' : i % 3 === 1 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 90, 0],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 90, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              // initial={false}
            />
          ))}
        </div>
      </div>
    );
  };