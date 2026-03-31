"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckSquare, FileText, Code, Calendar, User, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "todos", label: "Todos", icon: CheckSquare },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "dsa", label: "DSA", icon: Code },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("todos");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const index = navItems.findIndex(item => item.id === prev);
        return navItems[(index + 1) % 3].id; // Cycle through first 3
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-background flex overflow-hidden text-[10px] select-none">
      {/* Mini Sidebar */}
      <div className="w-16 sm:w-24 border-r border-border bg-surface flex flex-col p-2 gap-4">
        <div className="flex items-center gap-1.5 px-1 mb-2">
          <div className="h-4 w-4 bg-primary rounded flex items-center justify-center font-black text-white text-[8px]">
            {"</>"}
          </div>
          <span className="font-bold text-[8px] hidden sm:block">BhulnaJaana</span>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
                activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={10} />
              <span className="hidden sm:block font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mini Header */}
        <div className="h-8 border-b border-border flex items-center justify-between px-4 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 bg-muted px-2 py-0.5 rounded-md w-32">
            <Search size={8} className="text-muted-foreground" />
            <div className="h-2 w-16 bg-muted-foreground/20 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Bell size={10} className="text-muted-foreground" />
            <div className="h-4 w-4 rounded-full bg-primary/20 border border-primary/20" />
          </div>
        </div>

        {/* Mini Dynamic View */}
        <div className="flex-1 p-4 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="h-full flex flex-col gap-3"
            >
              {activeTab === "todos" && (
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-foreground/10 rounded mb-4" />
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-2 border border-border rounded-lg flex items-center gap-2 bg-surface shadow-sm">
                      <div className={cn("h-3 w-3 rounded-full border border-muted-foreground", i === 1 && "bg-primary border-primary")} />
                      <div className={cn("h-2 rounded bg-muted-foreground/20", i === 1 ? "w-32" : "w-24")} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "notes" && (
                <div className="grid grid-cols-2 gap-3 h-full">
                  <div className="border border-border rounded-lg p-2 bg-surface font-mono text-[6px] text-muted-foreground leading-relaxed">
                    <div className="text-primary font-bold mb-1"># Algorithms</div>
                    <div className="mt-1">- Dynamic Programming</div>
                    <div>- Graph Traversal</div>
                    <div className="h-10 w-full bg-muted/50 rounded mt-2" />
                  </div>
                  <div className="border border-border rounded-lg p-3 bg-primary/[0.02] space-y-2">
                    <div className="h-3 w-20 bg-foreground/10 rounded" />
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded" />
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded" />
                      <div className="h-1.5 w-2/3 bg-muted-foreground/10 rounded" />
                    </div>
                    <div className="pt-2 flex gap-1">
                      {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-6 bg-primary/10 rounded" />)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "dsa" && (
                <div className="h-full border border-border rounded-lg bg-[#0E0E10] overflow-hidden flex flex-col">
                  <div className="h-4 border-b border-white/5 bg-white/5 flex items-center px-2 gap-1.5">
                    <div className="flex gap-1">
                      <div className="h-1 w-1 rounded-full bg-red-500/50" />
                      <div className="h-1 w-1 rounded-full bg-yellow-500/50" />
                      <div className="h-1 w-1 rounded-full bg-green-500/50" />
                    </div>
                    <div className="h-1.5 w-12 bg-white/10 rounded" />
                  </div>
                  <div className="flex-1 p-3 font-mono text-[7px] text-cyan-400/80 leading-tight space-y-1">
                    <div className="text-purple-400">function solve(n) {"{"}</div>
                    <div className="pl-2">let result = [];</div>
                    <div className="pl-2">for(let i=0; i&lt;n; i++) {"{"}</div>
                    <div className="pl-4 text-white/40">// ... logic here</div>
                    <div className="pl-2">{"}"}</div>
                    <div className="text-purple-400">{"}"}</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
