"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Search } from "lucide-react";

interface BrowserMockupProps {
  children: ReactNode;
}

export function BrowserMockup({ children }: BrowserMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-6xl mx-auto rounded-3xl border border-border bg-background shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      {/* Browser Header (Safari/Chrome style) */}
      <div className="h-12 border-b border-border bg-surface flex items-center px-6 justify-between gap-4">
        {/* Mac OS Control Buttons */}
        <div className="flex gap-2 min-w-[60px]">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-inner" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-inner" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-inner" />
        </div>

        {/* Simplified URL Bar */}
        <div className="flex-1 max-w-md h-8 bg-muted border border-border rounded-lg flex items-center px-3 gap-2 text-muted-foreground">
          <Search size={14} className="opacity-40" />
          <span className="text-[11px] font-medium tracking-tight">bhulnajaana.io/dashboard</span>
        </div>

        {/* Empty space for balance */}
        <div className="min-w-[60px]" />
      </div>

      {/* Screen Content */}
      <div className="relative aspect-[16/10] sm:aspect-video w-full bg-surface overflow-hidden">
        {children}
      </div>
      
      {/* Dynamic Glow */}
      <div className="absolute inset-x-0 -bottom-10 h-20 bg-primary/20 blur-[100px] -z-10" />
    </motion.div>
  );
}
