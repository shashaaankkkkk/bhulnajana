"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Edit2, 
  ExternalLink, 
  Clock, 
  Trash2, 
  Check, 
  List, 
  LayoutGrid, 
  Plus, 
  Target, 
  CheckCircle2, 
  Search,
  Calendar,
  Filter
} from "lucide-react";
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
  category: "task" | "dsa";
  problemLink?: string;
  deadline?: string;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  
  // New/Edit todo form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState<"task" | "dsa">("task");
  const [problemLink, setProblemLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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

  const createOrUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);

    const payload: any = { 
      title, 
      description, 
      category,
      status: editingTodo ? editingTodo.status : "pending" 
    };
    if (problemLink.trim()) payload.problemLink = problemLink;
    if (deadline) payload.deadline = new Date(deadline).toISOString();

    try {
      const url = editingTodo ? `/api/todos/${editingTodo._id}` : "/api/todos";
      const method = editingTodo ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingTodo) {
          setTodos(todos.map(t => t._id === saved._id ? saved : t));
        } else {
          setTodos([saved, ...todos]);
        }
        resetForm();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setCategory("task");
    setProblemLink("");
    setEditingTodo(null);
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || "");
    setDeadline(todo.deadline ? format(new Date(todo.deadline), "yyyy-MM-dd") : "");
    setCategory(todo.category || "task");
    setProblemLink(todo.problemLink || "");
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
    if (!confirm("Delete this task?")) return;
    setTodos(todos.filter(t => t._id !== id));
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch {
      fetchTodos();
    }
  };

  const filteredTodos = todos.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = todos.filter(t => t.status === "completed").length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 h-full bg-background transition-all duration-300">
      <main className="flex-1 min-w-0 space-y-8 order-2 lg:order-1">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your objectives and progress.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 w-full sm:w-48 bg-surface border-border rounded-xl focus:ring-primary/20"
                />
             </div>
             <div className="flex items-center space-x-1 bg-surface p-1 rounded-xl border border-border">
                <button 
                  onClick={() => setView("list")}
                  className={cn("p-1.5 rounded-lg transition-all", view === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setView("grid")}
                  className={cn("p-1.5 rounded-lg transition-all", view === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                  <LayoutGrid size={18} />
                </button>
             </div>
          </div>
        </header>

        {/* TASK FORM */}
        <section>
          <form onSubmit={createOrUpdateTodo} className="relative z-10">
            <MotionCard className={cn(
               "overflow-hidden border border-border shadow-sm rounded-2xl bg-surface transition-all duration-300",
               editingTodo && "border-primary/30 ring-4 ring-primary/5"
            )}>
              <CardContent className="p-0">
                 <div className="flex flex-col sm:flex-row gap-0 sm:items-center p-3">
                    <div className="flex-1 px-4 py-2">
                      <Input 
                         placeholder={editingTodo ? "Edit task title..." : "Add a new task..."} 
                         value={title}
                         onChange={e => setTitle(e.target.value)}
                         className="border-none bg-transparent shadow-none text-lg font-semibold focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/30"
                       />
                    </div>
                    <div className="px-2 flex gap-2">
                       {editingTodo ? (
                         <Button type="button" variant="ghost" onClick={resetForm} size="sm" className="rounded-lg h-9">
                           Cancel
                         </Button>
                       ) : null}
                       <Button type="submit" disabled={isCreating || !title.trim()} size="sm" className="h-9 px-4 rounded-lg font-bold shadow-lg shadow-primary/10">
                         {editingTodo ? "Save Changes" : "Create Task"}
                       </Button>
                    </div>
                 </div>

                 {(title.trim().length > 0 || editingTodo) && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     className="px-6 py-5 space-y-5 border-t border-border/50 bg-background/20"
                   >
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1">Category</label>
                           <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/40">
                              <button 
                                type="button" 
                                onClick={() => setCategory("task")}
                                className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all", category === "task" ? "bg-background text-primary shadow-sm" : "text-muted-foreground/60 hover:text-foreground")}
                              >Core Task</button>
                              <button 
                                type="button" 
                                onClick={() => setCategory("dsa")}
                                className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all", category === "dsa" ? "bg-background text-cyan-500 shadow-sm" : "text-muted-foreground/60 hover:text-foreground")}
                              >DSA Prob</button>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1">Deadline</label>
                           <Input 
                             type="date" 
                             value={deadline}
                             onChange={e => setDeadline(e.target.value)}
                             className="h-10 rounded-xl bg-surface border-border/60 text-xs font-medium"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1">Notes & Specifications</label>
                        <textarea 
                           placeholder="Describe the objective, sub-tasks, or context..." 
                           value={description}
                           onChange={e => setDescription(e.target.value)}
                           className="w-full h-20 bg-surface border border-border/60 rounded-xl p-3 text-sm font-medium outline-none focus:border-primary/40 transition-all resize-none"
                         />
                     </div>

                     {category === "dsa" && (
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/60 px-1">Problem Link</label>
                           <Input 
                             placeholder="LeetCode, GFG, or Codeforces link..." 
                             value={problemLink}
                             onChange={e => setProblemLink(e.target.value)}
                             className="h-10 rounded-xl bg-surface border-border/60 text-cyan-600 text-xs truncate"
                           />
                        </div>
                     )}
                   </motion.div>
                 )}
              </CardContent>
            </MotionCard>
          </form>
        </section>

        {/* TASK LIST */}
        <section className="flex-1">
          {loading ? (
             <div className="h-40 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/50 rounded-2xl border-2 border-dashed border-border/50">
               <Target size={32} className="text-muted-foreground/20 mb-4" />
               <p className="text-sm font-medium text-muted-foreground/40">No tasks found. Start adding goals above.</p>
            </div>
          ) : (
            <motion.div layout className={cn("grid gap-4 w-full", view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTodos.map(todo => (
                  <MotionCard 
                    layout
                    key={todo._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={cn(
                      "group bg-surface border border-border rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-black/5 hover:border-primary/20 relative flex flex-col",
                      todo.status === "completed" ? "opacity-60 bg-muted/40 grayscale-[0.5]" : "shadow-sm",
                      view === "list" ? "md:flex-row md:items-center gap-4" : "gap-3 min-h-[160px]"
                    )}
                  >
                    <button 
                      onClick={() => toggleStatus(todo)}
                      className={cn(
                        "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0",
                        todo.status === "completed" ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary/50 text-transparent"
                      )}
                    >
                      <Check size={14} strokeWidth={4} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={cn("text-base font-bold text-foreground truncate", todo.status === "completed" && "line-through opacity-50")}>
                           {todo.title}
                        </h3>
                        {todo.category === "dsa" && <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />}
                      </div>
                      <p className={cn("text-xs font-medium text-muted-foreground line-clamp-1 opacity-70", todo.status === "completed" && "opacity-30")}>
                         {todo.description || "No description"}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                         {todo.deadline && (
                           <div className="flex items-center px-1.5 py-0.5 bg-muted rounded-md text-[10px] font-bold text-muted-foreground/80 border border-border/50">
                              <Calendar size={10} className="mr-1" />
                              {format(new Date(todo.deadline), "MMM d")}
                           </div>
                         )}
                         {todo.problemLink && (
                           <a href={todo.problemLink} target="_blank" className="flex items-center px-1.5 py-0.5 bg-cyan-500/5 rounded-md text-[10px] font-bold text-cyan-600 hover:bg-cyan-500/10 border border-cyan-500/10 transition-all">
                              <ExternalLink size={10} className="mr-1" /> Problem Link
                           </a>
                         )}
                      </div>
                    </div>

                    <div className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", view === "list" ? "ml-auto" : "mt-2 pt-2 border-t border-border/30")}>
                       <button onClick={() => startEdit(todo)} title="Edit" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center justify-center">
                          <Edit2 size={14} />
                       </button>
                       <button onClick={() => deleteTodo(todo._id)} title="Delete" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg transition-all flex items-center justify-center">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </MotionCard>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      <aside className="space-y-8 order-1 lg:order-2 h-fit lg:sticky lg:top-8">
        <MiniCalendar />
        <ProStats completedCount={completedCount} totalCount={todos.length} progressPercent={progressPercent} />
      </aside>
    </div>
  );
}
