"use client";

import { useEffect, useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek, 
  isSameDay
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Check, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Todo = {
  _id: string;
  title: string;
  status: "pending" | "completed";
  category: "task" | "dsa";
  problemLink?: string;
  deadline?: string;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Quick Add State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"task" | "dsa">("task");
  const [newTaskLink, setNewTaskLink] = useState("");
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
    if (!newTaskTitle.trim() || !selectedDate) return;
    setIsCreating(true);

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: newTaskTitle, 
          status: "pending",
          category: newTaskCategory,
          problemLink: newTaskLink,
          deadline: selectedDate.toISOString() 
        }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setNewTaskTitle("");
        setNewTaskLink("");
        setNewTaskCategory("task");
        setSelectedDate(null);
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

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Saturday

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] xl:h-[calc(100vh-6rem)] -mt-2 bg-background">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
             Calendar
             <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-cyan-500/20">DSA Sync Active</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Plan and manage your engineering deadlines.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
          <div className="flex items-center bg-surface border border-border rounded-md">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border-none" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm font-medium w-32 text-center text-foreground">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border-none" onClick={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden bg-surface shadow-sm max-h-full">
        <div className="grid grid-cols-7 border-b border-border bg-surface-hover/50">
          {weekDays.map(day => (
            <div key={day} className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto min-h-0 hide-scrollbar">
          {calendarDays.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const dayTodos = todos.filter(t => t.deadline && isSameDay(new Date(t.deadline), day));
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[80px] border-r border-b border-border p-1 md:p-1.5 lg:p-2 transition-colors cursor-pointer relative group flex flex-col",
                  !isCurrentMonth ? "bg-background/40" : "bg-surface hover:bg-surface-hover/50",
                  isSelected && "ring-2 ring-primary ring-inset z-10",
                  idx % 7 === 6 && "border-r-0"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-xs md:text-sm font-medium h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full transition-colors",
                    isTodayDate ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground",
                    !isCurrentMonth && !isTodayDate && "text-muted-foreground/40",
                  )}>
                    {format(day, "d")}
                  </span>
                  
                  <button 
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity p-0.5 md:p-1"
                    onClick={(e) => { e.stopPropagation(); setSelectedDate(day); }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto hide-scrollbar pb-1">
                  {dayTodos.map(todo => (
                     <div 
                       key={todo._id}
                       onClick={(e) => { e.stopPropagation(); toggleStatus(todo); }}
                       className={cn(
                         "text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 md:py-1 rounded truncate flex items-center transition-colors group/todo",
                         todo.status === "completed" 
                           ? "bg-surface-hover text-muted-foreground line-through decoration-muted-foreground/50 border-transparent" 
                           : todo.category === "dsa"
                             ? "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 hover:bg-cyan-500/20 dark:text-cyan-400"
                             : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                       )}
                     >
                        <div className="flex-shrink-0 w-2.5 h-2.5 border rounded-sm mr-1 flex items-center justify-center transition-colors border-current/30">
                          {todo.status === "completed" && <Check size={8} strokeWidth={4} />}
                        </div>
                        <span className="truncate">{todo.title}</span>
                     </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                setSelectedDate(null);
                setNewTaskCategory("task");
                setNewTaskLink("");
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-surface border border-border rounded-xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Schedule Block</h2>
                  <p className="text-sm text-muted-foreground italic">Due on {format(selectedDate, "MMMM d, yyyy")}</p>
                </div>
              </div>
              
              <form onSubmit={createTodo} className="space-y-5">
                <div className="flex p-1 bg-muted rounded-lg gap-1">
                   <button
                     type="button"
                     onClick={() => setNewTaskCategory("task")}
                     className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all", newTaskCategory === "task" ? "bg-surface text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                   >
                     General Task
                   </button>
                   <button
                     type="button"
                     onClick={() => setNewTaskCategory("dsa")}
                     className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all", newTaskCategory === "dsa" ? "bg-cyan-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
                   >
                     DSA Revision
                   </button>
                </div>

                <div className="space-y-4">
                  <Input 
                    autoFocus
                    placeholder={newTaskCategory === "dsa" ? "e.g. Solve Binary Tree Traversal" : "What needs to be done?"}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="bg-background font-medium"
                  />
                  
                  {newTaskCategory === "dsa" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <Input 
                        placeholder="LeetCode / Problem Link (optional)" 
                        value={newTaskLink}
                        onChange={(e) => setNewTaskLink(e.target.value)}
                        className="bg-background text-xs"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => {
                    setSelectedDate(null);
                    setNewTaskCategory("task");
                    setNewTaskLink("");
                  }}>Cancel</Button>
                  <Button type="submit" disabled={!newTaskTitle.trim() || isCreating} className={cn(newTaskCategory === "dsa" && "bg-cyan-500 hover:bg-cyan-600 text-white")}>
                    {isCreating ? "Scheduling..." : newTaskCategory === "dsa" ? "Schedule Session" : "Add to Calendar"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
