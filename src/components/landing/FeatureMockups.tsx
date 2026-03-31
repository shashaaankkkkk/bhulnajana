"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Code, FileText, ListTodo, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureMockups() {
  const [activeTab, setActiveTab] = useState<"todo" | "dsa" | "notes">("todo");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "todo" ? "dsa" : prev === "dsa" ? "notes" : "todo"));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Built for <span className="text-primary italic">your</span> workflow.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experience a workspace that understands your needs. From mastering algorithms to managing daily chaos, BhulnaJaana keeps you centered.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { id: "todo", label: "Smart Task Management", icon: ListTodo, desc: "A todo list that stays out of your way." },
              { id: "dsa", label: "DSA Workspace", icon: Code, desc: "Solve, track, and master data structures." },
              { id: "notes", label: "Rich Markdown Notes", icon: FileText, desc: "Capture ideas with high-fidelity formatting." },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all duration-300 border border-transparent",
                  activeTab === tab.id 
                    ? "bg-surface border-border shadow-lg shadow-black/5" 
                    : "hover:bg-surface/50 opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    <tab.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{tab.label}</h4>
                    <p className="text-xs text-muted-foreground">{tab.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full bg-surface-hover/30 border border-border rounded-3xl p-4 sm:p-8 relative min-h-[450px] shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/50 via-cyan-500 to-primary/50" />
          
          <AnimatePresence mode="wait">
            {activeTab === "todo" && <MockTodo key="todo" />}
            {activeTab === "dsa" && <MockDSA key="dsa" />}
            {activeTab === "notes" && <MockNotes key="notes" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MockTodo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish Binary Tree problems", completed: false },
    { id: 2, text: "Revise System Design notes", completed: false },
    { id: 3, text: "Deploy BhulnaJaana MVP", completed: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prev => {
        const next = [...prev];
        const firstIncomplete = next.find(t => !t.completed);
        if (firstIncomplete) {
          firstIncomplete.completed = true;
          return next;
        }
        return prev.map(t => ({ ...t, completed: false }));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-sm space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ListTodo size={18} className="text-primary" />
          Today's Goals
        </h3>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Priority</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <motion.div
            layout
            key={task.id}
            className={cn(
              "p-4 rounded-xl border border-border flex items-center justify-between transition-colors",
              task.completed ? "bg-primary/5 border-primary/20" : "bg-background"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                task.completed ? "border-primary bg-primary" : "border-muted-foreground"
              )}>
                {task.completed && <CheckCircle2 size={12} className="text-primary-foreground" />}
              </div>
              <span className={cn(
                "text-sm transition-all duration-500",
                task.completed ? "text-muted-foreground line-through opacity-50" : "text-foreground font-medium"
              )}>
                {task.text}
              </span>
            </div>
            {task.completed && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-bold text-primary"
              >
                DONE
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MockDSA() {
  const [typedCode, setTypedCode] = useState("");
  const fullCode = "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n}";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedCode(fullCode.slice(0, index));
      index++;
      if (index > fullCode.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full h-full max-h-[350px] bg-[#0E0E10] border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl"
    >
      <div className="p-3 bg-surface border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] text-muted-foreground ml-2 font-mono">TwoSum.js</span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-100/10 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
          <Terminal size={10} />
          Optimal Solution
        </div>
      </div>
      <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden">
        <pre className="text-cyan-400">
          <code>{typedCode}<span className="animate-pulse">|</span></code>
        </pre>
      </div>
    </motion.div>
  );
}

function MockNotes() {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRendered(prev => !prev);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full grid grid-cols-2 gap-4 h-[300px]"
    >
      <div className="flex flex-col bg-background border border-border rounded-2xl overflow-hidden shadow-inner">
        <div className="p-2 bg-surface text-[10px] px-4 font-bold tracking-widest text-muted-foreground uppercase border-b border-border">Editor</div>
        <div className="p-4 font-mono text-[10px] text-muted-foreground/80 space-y-2">
          <AnimatePresence mode="wait">
            {!rendered ? (
              <motion.div key="md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-primary font-bold"># DP Patterns</p>
                <p className="mt-2">- Knapsack</p>
                <p>- LCS</p>
                <p>- Matrix Chain</p>
                <p className="mt-2">```python</p>
                <p>def solve():</p>
                <p>  pass</p>
                <p>```</p>
              </motion.div>
            ) : (
              <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-full pt-10">
                <FileText size={48} className="text-muted-foreground/10 animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col bg-background border border-border rounded-2xl overflow-hidden shadow-xl shadow-primary/5">
        <div className="p-2 bg-primary/5 text-[10px] px-4 font-bold tracking-widest text-primary uppercase border-b border-border">Preview</div>
        <div className="p-6 space-y-4">
          <AnimatePresence>
            {rendered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold border-b border-primary/20 pb-2">DP Patterns</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-surface rounded-lg text-[10px]">Knapsack</div>
                  <div className="p-2 bg-surface rounded-lg text-[10px]">LCS</div>
                </div>
                <div className="p-3 bg-muted rounded-xl border border-border flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-primary" />
                  <span className="text-[10px] text-muted-foreground italic truncate">Mastered 12 algorithms.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!rendered && (
            <div className="flex items-center justify-center h-full pt-10">
              <span className="text-[10px] font-bold text-muted-foreground animate-pulse tracking-widest">RENDERING...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
