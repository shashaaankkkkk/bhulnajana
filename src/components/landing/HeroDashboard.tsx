"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  ArrowRight,
  Link as LinkIcon,
  Layers,
  Monitor,
  Database,
  Hash,
  Bold,
  Italic,
  List,
  CheckSquare as CheckIcon,
  Trash2,
  Edit2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProStats } from "@/components/dashboard/ProStats";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const navItems = [
  { id: "todos", label: "Dashboard", icon: CheckSquare },
  { id: "notes", label: "Blueprints", icon: FileText },
  { id: "dsa", label: "DSA System", icon: Code },
  { id: "calendar", label: "Timeline", icon: Calendar },
];

export function HeroDashboard() {
  const [activeTab, setActiveTab] = useState("todos");
  const [isImmersive, setIsImmersive] = useState(false);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [mockTasks, setMockTasks] = useState([
    { id: "1", title: "Injest Binary Tree traversal logic", category: "dsa", problemLink: "leetcode.com/problems/binary-tree-inorder-traversal", completed: true, time: "2h" },
    { id: "2", title: "Architect the Real-World UI Sync", category: "task", completed: false, time: "Now" },
    { id: "3", title: "Verify Spaced Repetition Engine", category: "task", completed: false, time: "45m" },
  ]);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("task");
  const [editLink, setEditLink] = useState("");

  const toggleTask = (id: string) => {
    setMockTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const startEditing = (task: any) => {
    setIsEditing(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category || "task");
    setEditLink(task.problemLink || "");
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setMockTasks(prev => prev.map(t => t.id === isEditing ? { ...t, title: editTitle, category: editCategory, problemLink: editLink } : t));
    setIsEditing(null);
  };

  const completedCount = mockTasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / mockTasks.length) * 100);

  // Mock notes for the vault preview
  const mockNotes = [
    { _id: "n1", title: "SYSTEM_ARCHITECTURE", content: "# TECHNICAL_ARCHITECTURE\n\n- [ ] Task 1: Components\n- [ ] Task 2: State Flow", updatedAt: new Date().toISOString() },
    { _id: "n2", title: "DSA_OPTIMIZATION", content: "# ALGORITHM_DATA\n\n- [ ] DFS Optimization\n- [ ] BFS Visualization", updatedAt: new Date().toISOString() }
  ];

  return (
    <div className={cn(
      "w-full h-full bg-background flex text-[13px] sm:text-[14px] cursor-default border border-border/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700",
      isImmersive && "scale-[1.02] border-primary/20 shadow-primary/10"
    )}>
      {/* High-Fidelity Sidebar */}
      <div className={cn(
        "w-16 sm:w-56 lg:w-60 border-r border-border bg-surface flex flex-col p-4 sm:p-5 gap-8 transition-all",
        isImmersive && "w-0 opacity-0 p-0 border-none overflow-hidden"
      )}>
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
              onClick={() => { setActiveTab(item.id); setIsImmersive(false); setActiveNote(null); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                activeTab === item.id && !isImmersive
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
      <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {isImmersive && <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />}

        {/* Real Header Mirror */}
        <header className={cn(
          "h-14 border-b border-border flex items-center justify-between px-6 bg-surface/50 backdrop-blur-xl relative z-10 transition-all",
          isImmersive && "bg-background h-20 border-white/5"
        )}>
           {!isImmersive ? (
             <>
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
             </>
           ) : (
             <>
               <div className="flex items-center gap-6">
                  <button 
                    onClick={() => { setIsImmersive(false); setActiveNote(null); }}
                    className="h-10 px-4 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 transition-all border border-white/5"
                  >
                     <ChevronLeft size={16} /> Exit Vault
                  </button>
                  <div className="h-6 w-px bg-white/10" />
                  <span className="text-xl font-black tracking-tighter text-white uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                     {activeNote.title}
                  </span>
               </div>
               <div className="ml-auto flex items-center gap-4">
                  <div className="flex bg-muted/20 p-1 rounded-xl border border-white/5">
                     <div className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-black shadow-lg">Visual</div>
                  </div>
               </div>
             </>
           )}
        </header>

        {/* View Layouts */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isImmersive && activeTab === "todos" ? (
              /* REAL DASHBOARD VIEW (2-COLUMN) */
              <motion.div 
                key="todos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_320px] gap-8 h-full p-6 lg:p-8"
              >
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-tight">Focus System</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Engineering daily log • Sandbox Active</p>
                  </div>

                  {/* Enhanced In-place Edit Panel Simulation */}
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.form 
                        key="edit-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={saveEdit} 
                        className="bg-surface border-2 border-primary/20 rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4">
                           <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] px-2 py-1 bg-primary/10 rounded-full animate-pulse">EDITING_NODE</div>
                        </div>
                        <input 
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-xl font-black tracking-tighter uppercase mb-4 placeholder:opacity-20"
                          placeholder="UPDATE OBJECTIVE..."
                          autoFocus
                        />
                        <div className="flex flex-wrap gap-4 items-center">
                           <div className="flex bg-muted/30 p-1 rounded-xl">
                              <button type="button" onClick={() => setEditCategory("task")} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", editCategory === "task" ? "bg-white text-black" : "text-muted-foreground")}>CORE</button>
                              <button type="button" onClick={() => setEditCategory("dsa")} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", editCategory === "dsa" ? "bg-primary text-black" : "text-muted-foreground")}>DSA</button>
                           </div>
                           <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-xl border border-white/5">
                              <LinkIcon size={12} className="text-muted-foreground/40" />
                              <input 
                                value={editLink}
                                onChange={e => setEditLink(e.target.value)}
                                className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-tight w-full placeholder:opacity-10"
                                placeholder="PROBLEM_LINK_SYNC..."
                              />
                           </div>
                           <div className="flex items-center gap-2 ml-auto">
                              <button type="button" onClick={() => setIsEditing(null)} className="h-10 px-4 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">Cancel</button>
                              <button type="submit" className="h-10 px-6 bg-primary text-primary-foreground rounded-xl font-black uppercase text-[10px] tracking-widest">Commit</button>
                           </div>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div 
                        key="idle-panel"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEditing("new")}
                        className="bg-surface border border-border rounded-[28px] p-4 flex items-center shadow-lg hover:shadow-primary/10 transition-all cursor-text group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary/30 group-hover:text-primary transition-colors">
                           <Plus size={20} />
                        </div>
                        <span className="ml-4 font-bold tracking-tight text-muted-foreground/30 uppercase text-xs">Architect new focus node...</span>
                        <div className="ml-auto flex items-center gap-2 pr-2">
                           <div className="px-2 py-1 rounded bg-muted/40 text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">⌘+N</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    {mockTasks.map(task => (
                      <motion.div 
                        layout
                        key={task.id}
                        className={cn(
                          "p-6 bg-surface border-2 rounded-[32px] flex items-center gap-5 transition-all group relative overflow-hidden",
                          task.completed ? "border-border/10 opacity-40 grayscale" : "border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                        )}
                      >
                        <div 
                          onClick={() => toggleTask(task.id)}
                          className={cn(
                            "h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer",
                            task.completed ? "bg-primary border-primary text-black" : "border-muted-foreground/20 hover:border-primary/40"
                          )}
                        >
                          {task.completed && <CheckCircle2 size={16} strokeWidth={4} />}
                        </div>
                        <div className="flex-1 min-w-0" onClick={() => startEditing(task)}>
                          <div className="flex items-center gap-2 mb-1">
                             {task.category === "dsa" && <div className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-[8px] font-black uppercase tracking-widest">DSA_LAB</div>}
                             <span className={cn("font-black tracking-tight uppercase text-[13px] truncate", task.completed && "line-through")}>{task.title}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 opacity-40 font-black text-[9px] uppercase tracking-widest italic">
                             <span className="flex items-center gap-1.5"><Clock size={10} /> {task.time}</span>
                             {task.problemLink && <span className="flex items-center gap-1.5"><LinkIcon size={10} /> LINKED</span>}
                          </div>
                        </div>
                        <button 
                          onClick={() => startEditing(task)}
                          className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-black transition-all"
                        >
                           <Edit2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Metrics Sync (ProStats) */}
                <aside className="hidden lg:block overflow-y-auto pr-1">
                   <ProStats completedCount={completedCount} totalCount={mockTasks.length} progressPercent={progressPercent} />
                </aside>
              </motion.div>
            ) : activeTab === "notes" && !isImmersive ? (
              /* REAL NOTEBOOK GRID VIEW */
              <motion.div 
                key="notes"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12 p-6 lg:p-12"
              >
                <div className="flex items-center justify-between">
                   <div>
                     <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-tight">Digital Vault</h2>
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Technical Blueprint Archive</p>
                   </div>
                   <div className="h-14 px-6 bg-surface border-border border-2 rounded-[20px] flex items-center gap-4">
                      <LayoutGrid size={20} className="text-primary" />
                      <div className="h-6 w-px bg-border" />
                      <Plus size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {mockNotes.map((note) => (
                     <motion.div 
                        key={note._id} 
                        whileHover={{ y: -8, rotate: -1 }}
                        onClick={() => { setActiveNote(note); setIsImmersive(true); }}
                        className="bg-surface border-2 border-border rounded-[40px] p-8 hover:shadow-2xl hover:border-primary/40 transition-all cursor-pointer group flex flex-col h-64 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-8">
                           <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                              <FileText size={20} />
                           </div>
                        </div>
                        <div className="flex-1">
                           <div className="h-8 w-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mb-6">
                              <span className="text-[9px] font-black text-primary tracking-widest">ARCHIVE</span>
                           </div>
                           <h3 className="font-black text-xl uppercase tracking-tighter mb-3 group-hover:text-primary transition-colors">{note.title}</h3>
                           <p className="text-[11px] text-muted-foreground opacity-40 font-mono italic leading-relaxed line-clamp-2">
                              {note.content.substring(0, 100)}...
                           </p>
                        </div>
                        <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 italic">SYNC_OK • {format(new Date(note.updatedAt), "MMM d")}</span>
                           <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                     </motion.div>
                   ))}
                </div>
              </motion.div>
            ) : isImmersive ? (
              /* IMMERSIVE 3-COLUMN EDITOR SIMULATION */
              <motion.div 
                key="immersive-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full relative"
              >
                {/* Navigator Simulation */}
                <aside className="w-64 border-r border-white/5 bg-background flex flex-col hidden xl:flex">
                   <div className="p-6 border-b border-white/5 text-[10px] font-black uppercase tracking-widest opacity-30">Archive</div>
                   <div className="p-4 space-y-2">
                      {mockNotes.map(n => (
                        <div key={n._id} className={cn("p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight", n._id === activeNote._id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground/40")}>
                           {n.title}
                        </div>
                      ))}
                   </div>
                </aside>

                {/* Main Canvas Simulation */}
                <main className="flex-1 overflow-y-auto p-12 lg:p-20 flex flex-col items-center">
                   <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative">
                      <div className="prose prose-invert max-w-none">
                         <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                            h1: ({...props}) => <h1 className="text-5xl text-white italic underline decoration-primary decoration-8 underline-offset-[16px] mb-16" {...props} />,
                            p: ({...props}) => <p className="text-xl text-muted-foreground/60 leading-loose" {...props} />
                         }}>
                            {activeNote.content}
                         </ReactMarkdown>
                      </div>
                      <div className="absolute top-20 right-[-4px] flex flex-col gap-8 opacity-20">
                         <div className="h-[200px] w-1 bg-primary rounded-full" />
                      </div>
                   </div>
                </main>

                {/* Metrics Simulation */}
                <aside className="w-72 border-l border-white/5 bg-background hidden 2xl:flex flex-col p-8 gap-12">
                   <div>
                      <h4 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] mb-8">System Metrics</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Complexity</span>
                           <span className="text-lg font-black text-white">48 BP</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Stability</span>
                           <span className="text-lg font-black text-green-400">98%</span>
                        </div>
                      </div>
                   </div>
                   <div className="mt-auto">
                      <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                         <div className="flex items-center gap-2 mb-2">
                            <Layers size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Cloud Sync</span>
                         </div>
                         <p className="text-[9px] text-muted-foreground/60 font-medium leading-relaxed font-mono uppercase">Node_Active @ US-EAST</p>
                      </div>
                   </div>
                </aside>
              </motion.div>
            ) : activeTab === "dsa" ? (
              /* REAL DSA SYSTEM VIEW */
              <motion.div layout key="dsa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-12 w-12 bg-[#0E0E10] border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Code size={24} className="text-cyan-400" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black tracking-tight uppercase">LRU Cache Architecture</h2>
                      <p className="text-[10px] font-black uppercase text-cyan-400/40 tracking-[0.2em]">Runtime: O(1) • SPACE: O(N)</p>
                   </div>
                </div>
                <div className="flex-1 bg-[#09090B] rounded-[40px] border border-white/10 p-10 font-mono text-[14px] leading-relaxed shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
                   <div className="relative z-10">
                      <div className="text-purple-400">class <span className="text-cyan-400">LRUCache</span>:</div>
                      <div className="pl-6 text-purple-400">def <span className="text-cyan-400">__init__</span>(self, capacity: int):</div>
                      <div className="pl-12 text-white">self.cache = <span className="text-yellow-400">OrderedDict()</span></div>
                      <div className="pl-12 text-white">self.capacity = capacity</div>
                      <div className="pl-6 mt-4 text-purple-400">def <span className="text-cyan-400">get</span>(self, key: int) {"->"} int:</div>
                      <div className="pl-12 text-white italic opacity-40"># Logic for prioritized retrieval...</div>
                      <div className="pl-12 text-purple-400">if <span className="text-white">key</span> in <span className="text-white">self.cache</span>:</div>
                      <div className="pl-18 text-white">self.cache.<span className="text-cyan-400">move_to_end</span>(key)</div>
                      <div className="pl-18 text-purple-400">return <span className="text-white">self.cache[key]</span></div>
                      <div className="mt-8 p-4 bg-cyan-400/5 rounded-2xl border border-cyan-400/20">
                         <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-1">System Trace Log</div>
                         <div className="text-[10px] text-cyan-400/60 font-mono">CACHE_HIT (KEY=42) • LATENCY=0.04ms • REORDERING_QUEUE</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
