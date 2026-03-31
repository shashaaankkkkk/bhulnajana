"use client";

import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Activity, Box, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProStatsProps {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export function ProStats({ completedCount, totalCount, progressPercent }: ProStatsProps) {
  // Mock activity data for sparkline (last 7 days)
  const activityData = [4, 8, 5, 12, 10, 15, completedCount];
  const maxActivity = Math.max(...activityData, 1);

  return (
    <div className="space-y-6">
      {/* Primary Metrics Card */}
      <div className="bg-surface border border-border rounded-[32px] p-6 shadow-2xl shadow-primary/5 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <Box size={80} className="rotate-12" />
        </div>
        
        <div className="flex items-center gap-3 mb-8">
           <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Zap size={20} className="fill-current" />
           </div>
           <div>
              <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-foreground">Velocity Metrics</h3>
              <p className="text-[10px] font-medium text-muted-foreground opacity-40 uppercase tracking-widest">Real-time system load</p>
           </div>
        </div>

        <div className="space-y-6">
           {/* Progress Ring / Bar - Technical Version */}
           <div className="space-y-3">
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">Commit Efficiency</span>
                 <span className="text-2xl font-black tracking-tighter">{progressPercent}%</span>
              </div>
              <div className="h-3 w-full bg-muted/50 rounded-full p-0.5 border border-border/50">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progressPercent}%` }}
                   className="h-full bg-primary rounded-full relative shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer" />
                 </motion.div>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-primary opacity-60" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Resolved</span>
                 </div>
                 <div className="text-2xl font-black">{completedCount}</div>
                 <div className="text-[8px] font-bold text-muted-foreground uppercase mt-1">Objectives done</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-2 mb-2">
                    <Target size={14} className="text-primary opacity-60" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Queue</span>
                 </div>
                 <div className="text-2xl font-black">{totalCount - completedCount}</div>
                 <div className="text-[8px] font-bold text-muted-foreground uppercase mt-1">Active load</div>
              </div>
           </div>
        </div>
      </div>

      {/* Activity Sparkline Card */}
      <div className="bg-surface border border-border rounded-[32px] p-6 shadow-lg shadow-primary/5">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <Activity size={16} className="text-primary" />
               <span className="font-black uppercase tracking-widest text-[10px]">7D Output</span>
            </div>
            <div className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">
               PRO STREAK: 5🔥
            </div>
         </div>
         
         <div className="h-16 flex items-end gap-1.5 px-1 py-1 bg-muted/20 rounded-xl border border-border/30">
            {activityData.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxActivity) * 100}%` }}
                className={cn(
                  "flex-1 bg-primary/20 rounded-t-sm transition-all relative group/bar hover:bg-primary/40",
                  i === activityData.length - 1 && "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                )}
              >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {val}
                 </div>
              </motion.div>
            ))}
         </div>
         
         <div className="mt-4 flex justify-between text-[8px] font-black uppercase tracking-widest opacity-30">
            <span>MAR 25</span>
            <span>TODAY</span>
         </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-[#0E0E10] p-6 rounded-[32px] text-white border border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
         <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-primary" />
            <span className="font-black uppercase tracking-widest text-[10px]">Productivity Index</span>
         </div>
         <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black italic tracking-tighter">0.94</span>
            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">+12%</span>
         </div>
         <p className="text-[9px] text-muted-foreground mt-3 leading-relaxed font-medium uppercase opacity-60">
            Operating at peak architectural efficiency. Commit velocity sustained over 5 sessions.
         </p>
      </div>
    </div>
  );
}
