"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, FileText, ChevronLeft, Save, Eye, Edit3, Bold, Italic, List, CheckSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

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
  
  // Mobile active view state
  const [isMobileViewEditor, setIsMobileViewEditor] = useState(false);

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
        body: JSON.stringify({ title: "Untitled Note", content: "# New Note\n\n- [ ] Task 1\n- [ ] Task 2" }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        openNote(newNote);
      }
    } catch {
      // Handle error
    }
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
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newContent = before + prefix + selection + suffix + after;
    setEditContent(newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const deleteNote = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    setNotes(notes.filter(n => n._id !== id));
    if (activeNote?._id === id) {
      closeNote();
    }

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
    setIsMobileViewEditor(true);
    setIsPreview(false);
  };

  const closeNote = () => {
    setIsMobileViewEditor(false);
    setTimeout(() => setActiveNote(null), 300);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] xl:h-[calc(100vh-6rem)] -mt-2">
      <header className={cn("flex items-center justify-between mb-6", isMobileViewEditor ? "hidden md:flex" : "flex")}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
             Notes
             <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-primary/20">Rich-Text Engine</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Architect your technical blueprints.</p>
        </div>
        <Button onClick={createNote} className="font-bold shadow-lg shadow-primary/10">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Blueprint</span>
          <span className="sm:hidden">New</span>
        </Button>
      </header>

      <div className="flex-1 overflow-hidden flex gap-6 bg-surface border border-border rounded-xl shadow-sm relative">
        {/* Sidebar List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-border flex flex-col bg-background/50 backdrop-blur-md",
          isMobileViewEditor ? "hidden md:flex" : "flex"
        )}>
          {loading ? (
             <div className="flex-1 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No blueprints found.</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 p-3 space-y-2 scroll-smooth">
              {notes.map(note => (
                <button
                  key={note._id}
                  onClick={() => openNote(note)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all border text-sm group relative overflow-hidden",
                    activeNote?._id === note._id 
                      ? "bg-primary/5 border-primary/20 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-surface-hover/50"
                  )}
                >
                  {activeNote?._id === note._id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-bold truncate pr-2 tracking-tight", activeNote?._id === note._id ? "text-primary" : "text-foreground")}>
                      {note.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground line-clamp-1 text-xs mb-3 font-medium opacity-60">
                    {note.content.replace(/[#*`]/g, "")}
                  </p>
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
                    <span>{format(new Date(note.updatedAt), "MMM d • h:mm a")}</span>
                    <div className="flex items-center gap-2">
                       <Trash2 
                         size={14} 
                         className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 cursor-pointer" 
                         onClick={(e) => deleteNote(note._id, e)} 
                       />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-surface z-10 w-full absolute inset-0 md:relative md:flex",
          !isMobileViewEditor && "hidden md:flex"
        )}>
          {activeNote ? (
            <>
              {/* Editor Header */}
              <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-surface/80 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center flex-1 min-w-0">
                  <button 
                    onClick={closeNote}
                    className="mr-2 p-2 -ml-2 rounded-md hover:bg-surface-hover md:hidden transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <Input 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={saveNote}
                    className="border-none shadow-none text-lg font-black px-0 h-auto focus-visible:ring-0 bg-transparent tracking-tighter w-full uppercase"
                    placeholder="Note Title"
                  />
                </div>
                <div className="flex items-center space-x-1 pl-4">
                  <div className="bg-muted px-1 py-1 rounded-lg flex items-center gap-1 mr-2">
                     <button 
                       onClick={() => setIsPreview(false)}
                       className={cn("p-1.5 rounded-md transition-all", !isPreview ? "bg-surface text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                     >
                       <Edit3 size={16} />
                     </button>
                     <button 
                       onClick={() => setIsPreview(true)}
                       className={cn("p-1.5 rounded-md transition-all", isPreview ? "bg-surface text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                     >
                       <Eye size={16} />
                     </button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={saveNote} disabled={isSaving} className="hidden sm:inline-flex bg-transparent font-bold">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving" : "Save"}
                  </Button>
                </div>
              </div>

              {/* Toolbar */}
              {!isPreview && (
                <div className="h-10 border-b border-border bg-background/30 flex items-center px-4 gap-1 overflow-x-auto hide-scrollbar">
                   <button onClick={() => insertMarkdown("**", "**")} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground" title="Bold"><Bold size={16} /></button>
                   <button onClick={() => insertMarkdown("_", "_")} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground" title="Italic"><Italic size={16} /></button>
                   <div className="w-px h-4 bg-border mx-1" />
                   <button onClick={() => insertMarkdown("- ", "")} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground" title="Bullet List"><List size={16} /></button>
                   <button onClick={() => insertMarkdown("- [ ] ", "")} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground" title="Checklist"><CheckSquare size={16} /></button>
                   <div className="w-px h-4 bg-border mx-1" />
                   <button onClick={() => insertMarkdown("![Alt](", ")")} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground" title="Image"><ImageIcon size={16} /></button>
                   <button onClick={() => insertMarkdown("```python\n", "\n```")} className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground font-mono text-[10px] font-bold">CODE</button>
                </div>
              )}

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-background/20">
                {isPreview ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in duration-300">
                    <ReactMarkdown
                      components={{
                        h1: ({...props}) => <h1 className="text-3xl font-black tracking-tighter mb-6 pb-2 border-b border-border uppercase" {...props} />,
                        h2: ({...props}) => <h2 className="text-xl font-bold tracking-tight mb-4 mt-8" {...props} />,
                        ul: ({...props}) => <ul className="space-y-2 mb-4" {...props} />,
                        li: ({children}) => {
                          // Detect checklist
                          const text = children?.toString() || "";
                          if (text.startsWith("[ ]") || text.startsWith("[x]")) {
                            return (
                              <li className="flex items-center gap-3">
                                <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0", text.startsWith("[x]") ? "bg-primary border-primary text-white" : "border-muted-foreground/30")}>
                                  {text.startsWith("[x]") && <Plus size={12} className="rotate-45" />}
                                </div>
                                <span className={cn(text.startsWith("[x]") && "line-through opacity-50")}>
                                  {text.substring(4)}
                                </span>
                              </li>
                            );
                          }
                          return <li className="list-disc ml-6">{children}</li>;
                        },
                        code: ({...props}) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm border border-border" {...props} />,
                        pre: ({...props}) => <pre className="bg-[#0E0E10] p-6 rounded-2xl border border-border overflow-x-auto my-6 shadow-2xl" {...props} />,
                        img: ({...props}) => <img className="rounded-2xl border border-border shadow-lg my-8 max-w-full" {...props} />,
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
                    placeholder="Start drafting your architectural notes..."
                    className="w-full h-full min-h-[500px] resize-none bg-transparent outline-none text-foreground leading-relaxed text-base font-medium placeholder:opacity-30 scrollbar-hide"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8 bg-background/30 backdrop-blur-3xl">
              <div className="h-16 w-16 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mb-6 shadow-sm">
                <FileText className="h-8 w-8 text-primary shadow-sm" />
              </div>
              <p className="font-black text-xl text-foreground tracking-tight uppercase">No Blueprint Selected</p>
              <p className="text-sm max-w-[200px] mt-2 opacity-60">Choose a technical note from the architect list or create a new one to begin.</p>
              <Button variant="outline" onClick={createNote} className="mt-8 font-bold border-primary/20 text-primary hover:bg-primary/5">
                Create New
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
