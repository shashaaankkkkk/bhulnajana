"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  CheckSquare, 
  FileText, 
  Code, 
  Calendar, 
  Search, 
  Bell, 
  Plus, 
  LayoutGrid,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "todos", label: "Dashboard", icon: CheckSquare },
  { id: "notes", label: "Blueprints", icon: FileText },
  { id: "dsa", label: "DSA System", icon: Code },
  { id: "calendar", label: "Timeline", icon: Calendar },
];

export function HeroDashboard() {
  const [activeTab, setActiveTab] = useState("todos");
  const [mockTasks, setMockTasks] = useState([
    { id: 1, title: "Injest Binary Tree traversal logic", completed: true, time: "2h" },
    { id: 2, title: "Architect the Real-World UI Sync", completed: false, time: "Now" },
    { id: 3, title: "Verify Spaced Repetition Engine", completed: false, time: "45m" },
  ]);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setMockTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setMockTasks([{ id: Date.now(), title: newTask, completed: false, time: "Just Now" }, ...mockTasks]);
    setNewTask("");
  };

  return (
    <div className="w-full h-full bg-background flex text-[13px] sm:text-[14px] cursor-default border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* High-Fidelity Sidebar */}
      <div className="w-16 sm:w-56 lg:w-60 border-r border-border bg-surface flex flex-col p-4 sm:p-5 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-6 w-6 bg-primary rounded-lg flex items-center justify-center font-black text-white text-[10px]">
            {"</>"}
          </div>
          <span className="font-black tracking-tighter hidden sm:block uppercase text-xs">Bhulnajaana</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted font-medium"
              )}
            >
              <item.icon size={18} />
              <span className="hidden sm:block font-bold truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border/50 hidden sm:block">
           <div className="bg-muted/50 p-3 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-[8px] font-black uppercase opacity-40 tracking-widest mb-2">
                 <span>Sync Load</span>
                 <span>84%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-[84%]" />
              </div>
           </div>
        </div>
      </div>

      {/* High-Fidelity Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Real Header Mirror */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface/50 backdrop-blur-xl">
           <div className="flex-1 max-w-md hidden sm:block">
              <div className="flex items-center gap-3 bg-muted/50 border border-border/50 px-3 py-1.5 rounded-xl">
                 <Search size={14} className="text-muted-foreground/40" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Universal Search Engine...</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <Bell size={18} className="text-muted-foreground opacity-30" />
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 p-1">
                 <div className="w-full h-full bg-primary/20 rounded-[4px]" />
              </div>
           </div>
        </header>

        {/* View Layouts */}
        <div className="flex-1 overflow-hidden p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "todos" ? (
              /* REAL DASHBOARD VIEW (2-COLUMN) */
              <motion.div 
                key="todos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid lg:grid-cols-[1fr_260px] gap-8 h-full"
              >
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Focus System</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Engineering daily log • Sandbox Active</p>
                  </div>

                  <form onSubmit={addTask} className="bg-surface border border-border rounded-2xl p-1 flex items-center shadow-lg hover:shadow-primary/5 transition-all">
                    <input 
                      value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      placeholder="Commit new objective..."
                      className="flex-1 bg-transparent border-none outline-none px-4 font-bold tracking-tight text-xs"
                    />
                    <button type="submit" className="h-10 px-4 bg-primary text-primary-foreground rounded-xl font-black uppercase text-[9px] tracking-widest">
                       Injest
                    </button>
                  </form>

                  <div className="space-y-3">
                    {mockTasks.map(task => (
                      <motion.div 
                        layout
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "p-4 bg-surface border-2 rounded-2xl flex items-center gap-4 transition-all group cursor-pointer",
                          task.completed ? "border-border/30 opacity-60 grayscale" : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          task.completed ? "bg-primary border-primary text-black" : "border-muted-foreground/20"
                        )}>
                          {task.completed && <CheckCircle2 size={14} strokeWidth={4} />}
                        </div>
                        <div className="flex-1">
                          <h3 className={cn("font-black tracking-tight uppercase text-xs", task.completed && "line-through")}>{task.title}</h3>
                          <div className="flex items-center gap-3 mt-1 opacity-40 font-black text-[9px] uppercase tracking-widest">
                             <Clock size={10} /> {task.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Widget Sync */}
                <aside className="hidden lg:flex flex-col gap-6">
                   <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest mb-3 pr-1">
                        <span>April 2026</span>
                        <ChevronRight size={14} className="opacity-20" />
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                         {[...Array(28)].map((_, i) => (
                           <div key={i} className={cn(
                             "h-6 w-6 flex items-center justify-center text-[10px] rounded-lg",
                             i + 1 === 1 ? "bg-primary text-black font-black" : "text-muted-foreground/30"
                           )}>
                             {i + 1}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-primary p-5 rounded-[28px] text-primary-foreground shadow-xl shadow-primary/20">
                      <div className="flex items-center justify-between mb-4">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">Velocity</span>
                      </div>
                      <div className="text-xl font-black mb-1">68%</div>
                      <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                         <div className="h-full bg-white w-[68%]" />
                      </div>
                   </div>
                </aside>
              </motion.div>
            ) : activeTab === "notes" ? (
              /* REAL NOTEBOOK GRID VIEW */
              <motion.div 
                key="notes"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-4">Digital Blueprints</h2>
                   <div className="p-2 bg-surface border border-border rounded-xl">
                      <LayoutGrid size={16} className="text-primary" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { title: "SYSTEM ARCHITECTURE", desc: "Core infrastructure benchmarks for scalable systems...", date: "APR 01" },
                     { title: "ALGORITHM DATA", desc: "Graph traversal and DP optimization metrics...", date: "MAR 28" }
                   ].map((note, i) => (
                     <div key={i} className="bg-surface border border-border rounded-[28px] p-6 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group flex flex-col h-44">
                        <div className="h-8 w-8 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-500">
                          <FileText size={16} />
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-tight mb-2">{note.title}</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed opacity-60 font-mono italic">{note.desc}</p>
                        <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">{note.date}</span>
                           <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            ) : activeTab === "dsa" ? (
              /* REAL DSA SYSTEM VIEW */
              <motion.div 
                key="dsa"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col pt-4"
              >
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-10 w-10 bg-[#0E0E10] border border-white/5 rounded-xl flex items-center justify-center shadow-2xl">
                      <Code size={20} className="text-cyan-400" />
                   </div>
                   <h2 className="text-xl font-black tracking-tight uppercase">LRU Cache Design</h2>
                </div>
                <div className="flex-1 bg-[#0E0E10] rounded-2xl border border-white/10 p-6 font-mono text-[12px] leading-relaxed shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                      <Target size={120} />
                   </div>
                   <div className="text-purple-400">class <span className="text-cyan-400">LRUCache</span>:</div>
                   <div className="pl-4 text-purple-400">def <span className="text-cyan-400">__init__</span>(self, capacity):</div>
                   <div className="pl-8 text-white">self.cache = {"{}"}</div>
                   <div className="pl-8 text-white">self.capacity = capacity</div>
                   <div className="pl-4 mt-2 text-purple-400">def <span className="text-cyan-400">get</span>(self, key):</div>
                   <div className="pl-8 text-purple-400">if <span className="text-white">key</span> in <span className="text-white">self.cache</span>:</div>
                   <div className="pl-12 text-white italic opacity-30"># Logic for cache hit...</div>
                   <div className="pl-12 text-cyan-400 underline decoration-cyan-400/30">self.update(key)</div>
                   <div className="mt-4 text-primary animate-pulse font-black text-xs uppercase tracking-widest">--- Execution Trace Active ---</div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
