"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, FileText, ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

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
        body: JSON.stringify({ title: "Untitled Note", content: "Start typing here..." }),
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
  };

  const closeNote = () => {
    setIsMobileViewEditor(false);
    setTimeout(() => setActiveNote(null), 300); // delay for exit animation
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] xl:h-[calc(100vh-6rem)] -mt-2">
      <header className={cn("flex items-center justify-between mb-6", isMobileViewEditor ? "hidden md:flex" : "flex")}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Capture your thoughts and ideas.</p>
        </div>
        <Button onClick={createNote}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">New</span>
        </Button>
      </header>

      <div className="flex-1 overflow-hidden flex gap-6 bg-surface border border-border rounded-xl shadow-sm relative">
        {/* Sidebar List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-border flex flex-col bg-background/50",
          isMobileViewEditor ? "hidden md:flex" : "flex"
        )}>
          {loading ? (
             <div className="flex-1 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No notes found.</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 p-3 space-y-1 scroll-smooth">
              {notes.map(note => (
                <button
                  key={note._id}
                  onClick={() => openNote(note)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-colors border text-sm group",
                    activeNote?._id === note._id 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-transparent border-transparent hover:bg-surface-hover"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-medium truncate pr-2", activeNote?._id === note._id ? "text-primary" : "text-foreground")}>
                      {note.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs mb-2 leading-relaxed h-8">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/70">
                    <span>{format(new Date(note.updatedAt), "MMM d, h:mm a")}</span>
                    <Trash2 
                      size={14} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500" 
                      onClick={(e) => deleteNote(note._id, e)} 
                    />
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
              <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center w-full">
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
                    className="border-none shadow-none text-lg font-medium px-0 h-auto focus-visible:ring-0 bg-transparent tracking-tight w-full max-w-full truncate"
                    placeholder="Note Title"
                  />
                </div>
                <div className="flex items-center space-x-2 pl-2">
                  <Button variant="ghost" size="sm" onClick={saveNote} disabled={isSaving} className="hidden sm:inline-flex bg-transparent">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteNote(activeNote._id)} className="text-muted-foreground hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={saveNote}
                  placeholder="Start typing..."
                  className="w-full h-full min-h-[500px] resize-none bg-transparent outline-none text-foreground leading-relaxed text-base"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
              <div className="h-12 w-12 rounded-xl bg-surface-hover border border-border flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <p className="font-medium text-foreground">Select a note</p>
              <p className="text-sm max-w-[200px] mt-1">Choose a note from the list or create a new one to start writing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
