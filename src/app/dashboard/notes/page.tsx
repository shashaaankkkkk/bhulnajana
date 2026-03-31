"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, FileText, ChevronLeft, Save, Eye, Edit3, Bold, Italic, List, CheckSquare, Image as ImageIcon, Search, ArrowLeft, MoreVertical, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MotionCard } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Note = {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Editor state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Blueprint", content: "# New Technical Note\n\nDraft your architectural benchmarks here..." }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        openNote(newNote);
      }
    } catch { }
  };

  const saveNote = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    
    try {
      const res = await fetch(`/api/notes/${activeNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (res.ok) {
        const updated = await res.json();
        setActiveNote(updated);
        setNotes(notes.map(n => n._id === updated._id ? updated : n).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("note-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newContent = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    setEditContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const deleteNote = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to delete this blueprint?")) return;
    setNotes(notes.filter(n => n._id !== id));
    if (activeNote?._id === id) setActiveNote(null);
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
    } catch {
      fetchNotes();
    }
  };

  const openNote = (note: Note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsPreview(false);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
      <AnimatePresence mode="wait">
        {!activeNote ? (
          /* LIBRARY VIEW */
          <motion.div 
            key="library"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 space-y-8"
          >
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                   Blueprints
                </h1>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mt-4 opacity-40">
                   Technical Documentation Library
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search systems..." 
                    className="pl-11 pr-4 h-12 w-full md:w-64 bg-surface border-border/50 rounded-2xl focus:ring-primary shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={createNote} size="lg" className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Build New
                </Button>
              </div>
            </header>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-surface/30 rounded-[40px] border-2 border-dashed border-border/50 animate-in fade-in duration-500">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-40">No technical data found in archive.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNotes.map(note => (
                  <MotionCard
                    key={note._id}
                    onClick={() => openNote(note)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group bg-surface border border-border rounded-[32px] p-8 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 relative overflow-hidden flex flex-col h-64"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={(e) => deleteNote(note._id, e)} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-muted-foreground hover:text-red-500">
                         <Trash2 size={16} />
                       </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-10 w-10 mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-500">
                        <FileText size={20} />
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-foreground truncate mb-3 uppercase">
                        {note.title}
                      </h3>
                      <p className="text-xs text-muted-foreground/60 line-clamp-3 font-medium leading-relaxed font-mono">
                        {note.content.replace(/[#*`]/g, "").substring(0, 120)}...
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                         {format(new Date(note.updatedAt), "MMM d, yyyy")}
                       </span>
                       <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary animate-pulse" />
                    </div>
                  </MotionCard>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* IMMERSIVE EDITOR VIEW */
          <motion.div 
            key="editor"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col -mx-4 h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px]"
          >
            {/* Editor Toolbar Overlays */}
            <header className="h-20 flex items-center px-8 justify-between bg-background/80 backdrop-blur-2xl border-b border-border sticky top-0 z-50 shadow-sm">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" onClick={() => { saveNote(); setActiveNote(null); }} className="rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
                  <ArrowLeft size={16} /> Library
                </Button>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <Input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border-none shadow-none text-2xl font-black px-0 h-auto focus-visible:ring-0 bg-transparent tracking-tighter uppercase w-auto min-w-[200px]"
                  placeholder="BLUEPRINT NAME"
                />
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="bg-muted p-1 rounded-xl flex items-center gap-1">
                   <button 
                     onClick={() => setIsPreview(false)}
                     className={cn("p-2 rounded-lg transition-all", !isPreview ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                   >
                     <Edit3 size={18} />
                   </button>
                   <button 
                     onClick={() => setIsPreview(true)}
                     className={cn("p-2 rounded-lg transition-all", isPreview ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                   >
                     <Eye size={18} />
                   </button>
                 </div>
                 <Button onClick={saveNote} disabled={isSaving} className="rounded-xl font-black uppercase text-[10px] h-11 px-6 tracking-widest shadow-xl shadow-primary/20">
                    {isSaving ? "Syncing..." : "Commit Changes"}
                 </Button>
              </div>
            </header>

            {!isPreview && (
              <div className="h-12 border-b border-border bg-muted/30 flex items-center justify-center px-4 gap-4 overflow-x-auto">
                 <div className="flex items-center gap-1">
                   <button onClick={() => insertMarkdown("**", "**")} className="p-2 hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-primary"><Bold size={16} /></button>
                   <button onClick={() => insertMarkdown("_", "_")} className="p-2 hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-primary"><Italic size={16} /></button>
                 </div>
                 <div className="w-px h-4 bg-border" />
                 <div className="flex items-center gap-1">
                   <button onClick={() => insertMarkdown("- ", "")} className="p-2 hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-primary"><List size={16} /></button>
                   <button onClick={() => insertMarkdown("- [ ] ", "")} className="p-2 hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-primary"><CheckSquare size={16} /></button>
                 </div>
                 <div className="w-px h-4 bg-border" />
                 <div className="flex items-center gap-1">
                   <button onClick={() => insertMarkdown("![Blueprint](", ")")} className="p-2 hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-primary"><ImageIcon size={16} /></button>
                   <button onClick={() => insertMarkdown("```python\n", "\n```")} className="px-3 py-1 hover:bg-background rounded-lg transition-all text-muted-foreground font-black text-[10px] tracking-widest hover:text-primary">RUN_CODE</button>
                 </div>
              </div>
            )}

            <main className="flex-1 overflow-y-auto relative py-12 px-6">
               <div className="max-w-4xl mx-auto min-h-full bg-background rounded-[48px] p-8 md:p-16 shadow-2xl border border-border/50 relative overflow-hidden group">
                  {/* Notebook Decor Elements */}
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-red-500/10 hidden md:block" />
                  
                  {isPreview ? (
                    <div className="prose prose-lg dark:prose-invert max-w-none animate-in zoom-in-95 duration-500">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({...props}) => <h1 className="text-4xl font-black tracking-tighter mb-10 pb-4 border-b-4 border-primary uppercase italic" {...props} />,
                          h2: ({...props}) => <h2 className="text-2xl font-bold tracking-tight mb-6 mt-12 bg-muted inline-block px-3 py-1 rounded-lg" {...props} />,
                          ul: ({...props}) => <ul className="space-y-4 mb-8" {...props} />,
                          li: ({children, ...props}) => {
                            const isChecklist = Array.isArray(children) && children.some(child => child?.props?.type === "checkbox");
                            if (isChecklist) return <li className="flex items-start gap-4 my-2 list-none" {...props}>{children}</li>;
                            return <li className="list-disc ml-8 my-2 font-medium" {...props}>{children}</li>;
                          },
                          input: ({type, checked, ...props}) => {
                            if (type === "checkbox") {
                              return (
                                <div className={cn(
                                  "h-6 w-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all shadow-md",
                                  checked ? "bg-primary border-primary text-black" : "border-muted-foreground/30 bg-background"
                                )}>
                                  {checked && <Plus size={14} className="rotate-45" strokeWidth={4} />}
                                </div>
                              );
                            }
                            return <input type={type} checked={checked} {...props} />;
                          },
                          code: ({...props}) => <code className="bg-muted px-2 py-1 rounded font-mono text-sm border border-border text-primary font-bold" {...props} />,
                          pre: ({...props}) => <pre className="bg-[#0A0A0C] p-8 rounded-3xl border border-border overflow-x-auto my-10 shadow-inner" {...props} />,
                          img: ({...props}) => <img className="rounded-[32px] border-4 border-muted shadow-2xl my-12 max-w-full h-auto transform hover:scale-[1.01] transition-transform" {...props} />,
                        }}
                      >
                        {editContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      id="note-editor"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onBlur={saveNote}
                      placeholder="ARCHITECT NEW BENCHMARKS..."
                      className="w-full h-full min-h-[600px] resize-none bg-transparent outline-none text-foreground leading-relaxed text-lg font-bold font-mono placeholder:opacity-10 scrollbar-hide py-4"
                    />
                  )}
                  
                  {/* Functional Metadata Overlay */}
                  <div className="mt-16 pt-8 border-t border-border flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                     <span className="flex items-center gap-2">
                        <TrendingUp size={12} className="text-primary" /> System Online • Local Sync Active
                     </span>
                     <span>Archived {format(new Date(activeNote.updatedAt), "MMMM yyyy")}</span>
                  </div>
               </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
