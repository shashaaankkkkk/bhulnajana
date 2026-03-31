"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Check, Clock, List, LayoutGrid, CheckCircle2, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MotionCard, CardContent } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { ProStats } from "@/components/dashboard/ProStats";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  deadline?: string;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "grid">("list");
  
  // New todo form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);

    try {
      const payload: any = { title, status: "pending" };
      if (description.trim()) payload.description = description;
      if (deadline) payload.deadline = new Date(deadline).toISOString();

      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setTodos([newTodo, ...todos]);
        setTitle("");
        setDescription("");
        setDeadline("");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    setTodos(todos.map(t => t._id === todo._id ? { ...t, status: newStatus } : t));

    try {
      await fetch(`/api/todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, status: newStatus }),
      });
    } catch {
      setTodos(todos.map(t => t._id === todo._id ? { ...t, status: todo.status } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setTodos(todos.filter(t => t._id !== id));
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch {
      fetchTodos();
    }
  };

  const completedCount = todos.filter(t => t.status === "completed").length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-12 h-full">
      {/* Main Column */}
      <main className="flex-1 min-w-0 space-y-10 order-2 lg:order-1">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
               Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-60 uppercase tracking-widest text-[10px]">
               Engineering Daily Focus • {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-border shadow-sm">
            <button 
              onClick={() => setView("list")}
              className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setView("grid")}
              className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </header>

        {/* Create Form - Integrated directly */}
        <section>
          <form onSubmit={createTodo} className="relative z-10">
            <MotionCard className="overflow-hidden border-border bg-surface shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl">
              <CardContent className="p-1 items-start sm:items-center">
                 <div className="flex flex-col sm:flex-row gap-0 sm:items-center bg-muted/30 p-2 rounded-xl">
                   <div className="flex-1 px-4 py-2">
                     <Input 
                        placeholder="Injest new goal..." 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="border-none bg-transparent shadow-none text-base font-bold focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/30 focus:bg-transparent tracking-tight"
                      />
                   </div>
                   <Button type="submit" disabled={isCreating || !title.trim()} className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                     <Plus className="mr-2 h-4 w-4" />
                     Commit
                   </Button>
                 </div>

                 {title.trim().length > 0 && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     className="px-6 py-4 space-y-4 border-t border-border/50 bg-background/20"
                   >
                     <Input 
                        placeholder="Add architectural blueprint/desc..." 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="h-10 text-xs font-medium border-border/50"
                      />
                     <div className="flex items-center gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Deadline</label>
                        <Input 
                          type="date" 
                          value={deadline}
                          onChange={e => setDeadline(e.target.value)}
                          className="w-auto h-9 text-xs text-muted-foreground flex-1 border-border/50"
                        />
                     </div>
                   </motion.div>
                 )}
              </CardContent>
            </MotionCard>
          </form>
        </section>

        <section className="flex-1">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl" />
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-surface-hover/20 rounded-[32px] border-2 border-dashed border-border/50 shadow-sm animate-in fade-in duration-700">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/5">
                <Target size={40} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">Target Free Zone</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-3 font-medium italic opacity-60">
                All objectives summarized. Time to architect your next high-impact sprint.
              </p>
            </div>
          ) : (
            <motion.div 
              layout
              className={cn(
                "grid gap-5 w-full",
                view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {todos.map(todo => (
                  <MotionCard 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={todo._id}
                    className={cn(
                      "overflow-hidden transition-all duration-300 border-2 shadow-lg min-h-[100px] flex w-full flex-col hover:border-primary/30 group py-4",
                      todo.status === "completed" ? "bg-muted/30 border-border/40 grayscale" : "bg-surface border-border",
                      view === "list" ? "sm:flex-row sm:items-center px-6 gap-6" : "px-6 gap-4"
                    )}
                  >
                    <div className="flex-shrink-0 flex items-center gap-4 mb-2 sm:mb-0">
                      <button 
                        onClick={() => toggleStatus(todo)}
                        className={cn(
                          "h-7 w-7 rounded-lg border-2 flex items-center justify-center transition-all duration-500 shadow-md",
                          todo.status === "completed" 
                            ? "bg-primary border-primary text-black" 
                            : "border-muted-foreground/30 hover:border-primary/50 text-transparent"
                        )}
                      >
                        <Check size={16} strokeWidth={4} />
                      </button>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className={cn(
                        "text-lg font-black tracking-tight transition-all duration-500",
                        todo.status === "completed" ? "text-muted-foreground line-through opacity-40" : "text-foreground group-hover:text-primary"
                      )}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={cn(
                          "text-xs mt-2 line-clamp-2 transition-all font-medium opacity-60 font-mono tracking-tight",
                          todo.status === "completed" ? "text-muted-foreground/60" : "text-muted-foreground"
                        )}>
                          {todo.description}
                        </p>
                      )}
                      {todo.deadline && (
                        <div className="flex items-center mt-4 text-[10px] font-black uppercase tracking-widest text-primary/70">
                          <Clock size={12} className="mr-1.5" />
                          Target: {format(new Date(todo.deadline), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
    
                    <div className={cn(
                      "flex-shrink-0 flex items-center justify-end",
                      view === "grid" ? "w-full mt-4 pt-4 border-t border-border/50" : "w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 sm:border-l sm:border-border sm:pl-6"
                    )}>
                      <button 
                        onClick={() => deleteTodo(todo._id)}
                        className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all flex items-center justify-center group/del"
                      >
                        <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                      </button>
                    </div>
                  </MotionCard>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      {/* Sidebar Column */}
      <aside className="space-y-8 order-1 lg:order-2 h-fit lg:sticky lg:top-0">
        <MiniCalendar />

        {/* PRO METRICS OVERHAUL */}
        <ProStats 
           completedCount={completedCount} 
           totalCount={todos.length} 
           progressPercent={progressPercent} 
        />
      </aside>
    </div>
  );
}
