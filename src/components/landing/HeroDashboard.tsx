"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  CheckSquare, 
  FileText, 
  Code, 
  Calendar, 
  User, 
  Search, 
  Bell, 
  Plus, 
  LayoutGrid,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "todos", label: "Tasks", icon: CheckSquare },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "dsa", label: "DSA", icon: Code },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

export function HeroDashboard() {
  const [activeTab, setActiveTab] = useState("todos");
  const [mockTasks, setMockTasks] = useState([
    { id: 1, title: "Optimize Binary Tree DFS logic", priority: "High", time: "2h", completed: true },
    { id: 2, title: "Architect the Real UI Mockup", priority: "Medium", time: "1.5h", completed: false },
    { id: 3, title: "Review Spaced Repetition Logic", priority: "High", time: "45m", completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Note Interaction
  const [typedNote, setTypedNote] = useState("# Algorithms\n\n- Dynamic Programming\n- Graph Traversal\n\n```python\ndef solve(w, v, C):\n  dp = [[0] * (C+1)]\n  # iterate items\n```");

  const toggleTask = (id: number) => {
    setMockTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setMockTasks(prev => [{
      id: Date.now(),
      title: newTaskTitle,
      priority: "Medium",
      time: "Now",
      completed: false
    }, ...prev]);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  return (
    <div className="w-full h-full bg-background flex text-[13px] sm:text-[14px] cursor-default">
      {/* Real-style Sidebar */}
      <div className="w-16 sm:w-60 lg:w-64 border-r border-border bg-surface flex flex-col p-4 sm:p-6 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-6 w-6 bg-primary rounded-lg flex items-center justify-center font-black text-white text-[10px]">
            {"</>"}
          </div>
          <span className="font-bold tracking-tight hidden sm:block uppercase text-xs opacity-60">BhulnaJaana</span>
        </div>

        <div className="space-y-1.5">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:translate-x-1"
              )}
            >
              <item.icon size={18} />
              <span className="hidden sm:block font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-4 px-2 hidden sm:block">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
               animate={{ width: activeTab === "todos" ? "65%" : "40%" }} 
               className="h-full bg-primary transition-all duration-500" 
            />
          </div>
          <div className="flex items-center gap-2 group bg-muted p-2 rounded-lg">
             <div className="h-4 w-4 bg-primary/20 rounded border border-primary/20" />
             <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Sandbox Mode</span>
          </div>
        </div>
      </div>

      {/* Real-style Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        {/* Real Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface/50 backdrop-blur-xl">
           <div className="flex-1 max-w-xl">
             <div className="flex items-center gap-3 bg-muted border border-border px-4 py-2 rounded-xl group focus-within:border-primary/50 transition-colors">
               <Search size={16} className="text-muted-foreground" />
               <input 
                 readOnly 
                 placeholder="Search sandbox..." 
                 className="bg-transparent border-none outline-none text-muted-foreground w-full placeholder:text-muted-foreground/30 text-xs"
               />
             </div>
           </div>
           
           <div className="flex items-center gap-4 ml-6">
              <Bell size={20} className="text-muted-foreground opacity-30" />
              <div className="h-10 w-10 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-tr from-primary to-cyan-500 opacity-20" />
              </div>
           </div>
        </div>

        {/* Real View Content */}
        <div className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full max-w-4xl mx-auto"
            >
              {activeTab === "todos" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Today's Focus</h2>
                      <p className="text-muted-foreground text-sm">Interactive Sandbox Preview.</p>
                    </div>
                    {isAdding ? (
                      <form onSubmit={addTask} className="flex gap-2">
                        <input 
                          autoFocus
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          placeholder="Task name"
                          className="h-10 px-3 bg-surface border border-primary/50 rounded-xl text-xs outline-none focus:ring-1 ring-primary/20"
                        />
                        <button type="submit" className="h-10 px-4 bg-primary text-white rounded-xl text-xs font-bold">Add</button>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="h-10 px-5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                      >
                        <Plus size={18} /> New Goal
                      </button>
                    )}
                  </div>
                  
                  <div className="grid gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {mockTasks.map((task) => (
                      <motion.div 
                        layout
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "p-4 sm:p-5 bg-surface border border-border rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer shadow-sm",
                          task.completed && "opacity-60 bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300", 
                            task.completed ? "border-primary bg-primary scale-110" : "border-muted-foreground group-hover:border-primary")}>
                            {task.completed && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                          <div>
                            <span className={cn("font-bold text-base transition-all", task.completed && "line-through opacity-50")}>{task.title}</span>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium uppercase tracking-tight">
                               <div className="flex items-center gap-1">
                                  <Clock size={12} /> {task.time}
                               </div>
                               <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-widest text-[9px]">
                                  {task.priority}
                               </span>
                            </div>
                          </div>
                        </div>
                        <LayoutGrid size={18} className="text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="h-full flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                       <FileText size={24} className="text-primary" /> Dynamic Programming
                    </h2>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-surface border border-border rounded-lg text-xs font-bold">Preview</span>
                       <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold">Publish</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-6 pb-6">
                     <div className="bg-surface border border-border rounded-2xl p-6 font-mono text-[13px] text-muted-foreground leading-relaxed overflow-hidden">
                        <div className="text-primary font-bold mb-4"># Pattern: Knapsack</div>
                        <p className="mb-4">Given N items with weights and values, find the subset with max total value...</p>
                        <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                           <div className="text-cyan-400">def solve(w, v, C):</div>
                           <div className="pl-4">dp = [[0] * (C+1)]</div>
                           <div className="pl-4"># iterate items</div>
                        </div>
                     </div>
                     <div className="bg-background border-2 border-primary/10 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                           <CheckCircle2 size={48} className="text-primary opacity-5 group-hover:opacity-20 transition-opacity" />
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-2xl font-black">Architecture</h3>
                           <p className="text-muted-foreground leading-relaxed">The breakdown for the 0/1 Knapsack solution involves building a 2D table to store subproblem results...</p>
                           <div className="pt-6 grid grid-cols-2 gap-3">
                              <div className="h-10 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center font-bold text-primary">Mastered</div>
                              <div className="h-10 bg-muted rounded-xl border border-border flex items-center justify-center font-bold text-muted-foreground">Revision Required</div>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "dsa" && (
                <div className="h-full flex flex-col gap-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-[#0E0E10] border border-border rounded-xl flex items-center justify-center shadow-2xl">
                          <Code size={24} className="text-cyan-400" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black tracking-tight">TwoSum Problem</h2>
                          <p className="text-muted-foreground text-sm">LeetCode #1 • Medium • Array, Hash Map</p>
                       </div>
                    </div>
                    <div className="flex items-center h-10 px-4 bg-green-500/10 text-green-500 rounded-xl font-black italic border border-green-500/20 shadow-lg shadow-green-500/5">
                        ACCEPTED • 42ms
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-[#0E0E10] rounded-2xl border border-border overflow-hidden flex flex-col shadow-2xl">
                    <div className="h-10 bg-surface/30 border-b border-border flex items-center px-4 justify-between">
                       <div className="flex gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                          <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                          <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                       </div>
                       <span className="text-[10px] font-mono text-muted-foreground/60">solution.py</span>
                       <div />
                    </div>
                    <div className="flex-1 p-6 font-mono text-[14px] text-cyan-400/90 leading-relaxed overflow-hidden">
                      <div className="text-purple-400">def twoSum(nums, target):</div>
                      <div className="pl-4">prevMap = {"{}"} <span className="text-muted-foreground opacity-30 italic"># val : index</span></div>
                      <div className="pl-4 mt-2"><span className="text-purple-400">for</span> i, n <span className="text-purple-400">in</span> enumerate(nums):</div>
                      <div className="pl-8">diff = target - n</div>
                      <div className="pl-8"><span className="text-purple-400">if</span> diff <span className="text-purple-400">in</span> prevMap:</div>
                      <div className="pl-12 text-white">return [prevMap[diff], i]</div>
                      <div className="pl-8">prevMap[n] = i</div>
                      <div className="mt-4 text-white opacity-20 cursor animate-pulse">|</div>
                    </div>
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
