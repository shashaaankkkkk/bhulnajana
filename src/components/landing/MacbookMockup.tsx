"use client";

import { motion } from "framer-motion";
import { DashboardPreview } from "./DashboardPreview";

export function MacbookMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[800px] perspective-1000">
      {/* Macbook Screen Wrapper */}
      <motion.div
        initial={{ rotateX: 20, opacity: 0, y: 40 }}
        whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto w-full aspect-[1.6/1] bg-black rounded-[2rem] border-4 border-[#3c3c3c] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        {/* Screen Content */}
        <div className="absolute inset-0 bg-background overflow-hidden">
          <DashboardPreview />
        </div>
        
        {/* Screen Glare/Reflection */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
      </motion.div>

      {/* Macbook Base/Keyboard Shell */}
      <motion.div
        initial={{ scaleX: 0.8, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative -mt-4 mx-auto w-[105%] h-4 bg-gradient-to-b from-[#3c3c3c] to-[#1a1a1a] rounded-b-[1rem] shadow-2xl"
      >
        {/* Trackpad Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#1a1a1a] rounded-b-xl" />
      </motion.div>
      
      {/* Underlying Glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-primary/20 blur-[80px] -z-10" />
    </div>
  );
}

export function DashboardShowcase() {
  return (
    <section id="preview" className="py-24 lg:py-32 overflow-hidden bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            The Full <span className="text-primary italic">Experience</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Switch tasks, solve algorithms, and capture notes in a single, fluid workspace that adapts to your mental model.
          </motion.p>
        </div>

        <MacbookMockup />
      </div>
    </section>
  );
}
