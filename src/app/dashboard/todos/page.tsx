"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Check, Clock, List, LayoutGrid, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MotionCard, CardContent } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    // Optimistic update
    setTodos(todos.map(t => t._id === todo._id ? { ...t, status: newStatus } : t));

    try {
      await fetch(`/api/todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, status: newStatus }),
      });
    } catch {
      // Revert on failure
      setTodos(todos.map(t => t._id === todo._id ? { ...t, status: todo.status } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    // Optimistic update
    setTodos(todos.filter(t => t._id !== id));

    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
    } catch {
      fetchTodos();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your daily goals and deadlines.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-surface p-1 rounded-lg border border-border">
          <button 
            onClick={() => setView("list")}
            className={cn("p-1.5 rounded-md transition-all", view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setView("grid")}
            className={cn("p-1.5 rounded-md transition-all", view === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </header>

      <form onSubmit={createTodo} className="mb-8 relative z-10">
        <MotionCard className="overflow-hidden border-border bg-surface shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 w-full space-y-3">
              <Input 
                placeholder="What needs to be done?" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border-none bg-transparent shadow-none text-base sm:text-lg focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/60 focus:bg-transparent"
              />
              {title.trim().length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/50"
                >
                  <Input 
                    placeholder="Add description (optional)" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="flex-1 h-9 text-sm"
                  />
                  <Input 
                    type="date" 
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full sm:w-auto h-9 text-sm text-muted-foreground min-w-[140px]"
                  />
                </motion.div>
              )}
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <Button type="submit" disabled={isCreating || !title.trim()} className="w-full sm:w-auto mt-2 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </MotionCard>
      </form>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : todos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface rounded-2xl border border-dashed border-border/60">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-medium text-foreground">No tasks yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Add a task above to get started. Your tasks sync securely across all your devices.
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className={cn(
            "grid gap-4 w-full",
            view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout">
            {todos.map(todo => (
              <MotionCard 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={todo._id}
                className={cn(
                  "overflow-hidden transition-colors border shadow-sm cursor-default flex w-full flex-col",
                  todo.status === "completed" ? "bg-surface-hover/50 border-border/40" : "bg-surface border-border",
                  view === "list" ? "sm:flex-row sm:items-center p-4 sm:p-5 gap-4" : "p-5 gap-4"
                )}
              >
                <div className="flex-shrink-0 flex items-center gap-4 mb-2 sm:mb-0">
                  <button 
                    onClick={() => toggleStatus(todo)}
                    className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm",
                      todo.status === "completed" 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-muted-foreground/30 hover:border-primary/50 text-transparent"
                    )}
                  >
                    <Check size={14} strokeWidth={3} />
                  </button>
                  <div className={cn("block sm:hidden flex-1", todo.status === "completed" ? "opacity-60" : "")}>
                    <h3 className="text-base font-medium truncate">{todo.title}</h3>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className={cn(
                    "hidden sm:block text-base font-medium truncate transition-colors",
                    todo.status === "completed" ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
                  )}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={cn(
                      "text-sm mt-1 line-clamp-2 transition-colors break-words",
                      todo.status === "completed" ? "text-muted-foreground/60" : "text-muted-foreground"
                    )}>
                      {todo.description}
                    </p>
                  )}
                  {todo.deadline && (
                    <div className="flex items-center mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <Clock size={12} className="mr-1" />
                      {format(new Date(todo.deadline), "MMM d, yyyy")}
                    </div>
                  )}
                </div>

                <div className={cn(
                  "flex-shrink-0 flex items-center justify-end",
                  view === "grid" ? "w-full mt-auto pt-4 border-t border-border/50" : "w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 sm:border-l sm:border-border sm:pl-4"
                )}>
                  <button 
                    onClick={() => deleteTodo(todo._id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                    <span className="sm:hidden">Delete</span>
                  </button>
                </div>
              </MotionCard>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
