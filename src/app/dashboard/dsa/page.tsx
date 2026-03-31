"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Code, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DSAModal } from "@/components/dsa/DSAModal";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DSANote {
  _id: string;
  title: string;
  type: "problem" | "theory";
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  status?: "Solved" | "Attempted" | "Revisit";
  updatedAt: string;
}

export default function DSADashboard() {
  const [notes, setNotes] = useState<DSANote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "problem" | "theory">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/dsa");
      const data = await res.json();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<DSANote>) => {
    const res = await fetch("/api/dsa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || 
                         (note.category?.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === "all" || note.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">DSA Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your LeetCode solutions and computer science theory.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto h-11 px-6 shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" />
          Add Entry
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search problems or categories..." 
            className="pl-10 h-12 bg-surface border-border/50 hover:border-primary/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterType === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("all")}
            className="h-12 px-4 whitespace-nowrap"
          >
            All
          </Button>
          <Button 
            variant={filterType === "problem" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("problem")} 
            className="h-12 px-4 whitespace-nowrap"
          >
            Problems
          </Button>
          <Button 
            variant={filterType === "theory" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType("theory")}
            className="h-12 px-4 whitespace-nowrap"
          >
            Theory
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-surface border border-border rounded-2xl animate-pulse" />)}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl bg-surface/30">
          <div className="p-4 bg-background rounded-full mb-4">
            <Code size={32} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No entries found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mt-2">
            Start by adding your first DSA problem or theory note.
          </p>
          <Button variant="ghost" className="mt-6" onClick={() => setIsModalOpen(true)}>
            Add first entry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 md:pb-12">
          {filteredNotes.map((note, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={note._id}
            >
              <Link href={`/dashboard/dsa/${note._id}`}>
                <div className="group h-full p-6 bg-surface border border-border rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {note.type === "problem" ? (
                          <>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase",
                              note.difficulty === "Easy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                              note.difficulty === "Medium" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                              {note.difficulty}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase",
                              note.status === "Solved" ? "bg-primary/10 text-primary" :
                              note.status === "Revisit" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                              "bg-surface text-muted-foreground border border-border"
                            )}>
                              {note.status || "Attempted"}
                            </span>
                          </>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Theory
                          </span>
                        )}
                      </div>
                      {note.category && (
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{note.category}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {note.title}
                    </h3>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                    <div className="p-2 rounded-full bg-surface-hover opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                      <ChevronRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <DSAModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}
