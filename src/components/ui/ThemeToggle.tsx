"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ y: theme === "dark" ? -40 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="h-4 w-4 flex items-center justify-center">
          <Sun size={16} className="text-amber-500" />
        </div>
        <div className="h-4 w-4 mt-6 flex items-center justify-center">
          <Moon size={16} className="text-indigo-400" />
        </div>
      </motion.div>
    </button>
  );
}
