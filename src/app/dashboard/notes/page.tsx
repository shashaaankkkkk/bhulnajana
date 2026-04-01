"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { format } from "date-fns";
import { 
  Plus, 
  Trash2, 
  FileText, 
  ChevronLeft, 
  Search, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  List, 
  CheckSquare, 
  Share2, 
  Download, 
  FileDown, 
  Map as MapIcon, 
  X,
  Target,
  Code,
  PanelLeftClose,
  PanelLeftOpen,
  CloudCheck,
  Layers,
  Sparkles,
  Command,
  ArrowRight,
  Type,
  Link as LinkIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MotionCard } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

type Note = {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
};

// ... Types for Graph remain same ...

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [mode, setMode] = useState<"markdown" | "visual">("markdown");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  // Editor & Suggestion state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionType, setSuggestionType] = useState<"link" | "slash">("link");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } finally { setLoading(false); }
  };

  const createNote = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Insight", content: "# Exploring Thoughts\n\n- [[Link something]]\n- **Bold text**" }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        openNote(newNote);
      }
    } catch { }
  };

  const saveNote = useCallback(async (title: string, content: string) => {
    if (!activeNote) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/notes/${activeNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes(prev => prev.map(n => n._id === updated._id ? updated : n).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        setLastSaved(new Date());
      }
    } finally { setIsSaving(false); }
  }, [activeNote]);

  const deleteNote = async (id: string) => {
    if (!confirm("Delete this thought forever?")) return;
    try {
       await fetch(`/api/notes/${id}`, { method: "DELETE" });
       setNotes(notes.filter(n => n._id !== id));
       setActiveNote(null);
    } catch { }
  };

  // Debounced Auto-save
  useEffect(() => {
    if (!activeNote) return;
    const timer = setTimeout(() => {
      if (editTitle !== activeNote.title || editContent !== activeNote.content) {
        saveNote(editTitle, editContent);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [editTitle, editContent, activeNote, saveNote]);

  const openNote = (note: Note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setMode("markdown");
    setLastSaved(new Date(note.updatedAt));
    setSuggestions([]);
  };

  const SLASH_COMMANDS = [
    { id: 'table', title: 'Table', snippet: '| Col 1 | Col 2 |\n|---|---|\n| Cell | Cell |', icon: <TableIcon size={16} /> },
    { id: 'code', title: 'Code Block', snippet: '```\n\n```', icon: <Code size={16} /> },
    { id: 'h1', title: 'Heading 1', snippet: '# ', icon: <Heading1 size={16} /> },
    { id: 'h2', title: 'Heading 2', snippet: '## ', icon: <Heading2 size={16} /> },
    { id: 'task', title: 'Task List', snippet: '- [ ] ', icon: <CheckSquare size={16} /> },
  ];

  // --- INTELLIGENT EDITOR LOGIC ---
  
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;

    // 1. Navigation for suggestions
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => (i + 1) % suggestions.length); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => (i - 1 + suggestions.length) % suggestions.length); return; }
      if (e.key === "Enter" || e.key === "Tab") { 
        e.preventDefault(); 
        if (suggestionType === "link") insertLink(suggestions[selectedIndex].title);
        else insertSnippet(suggestions[selectedIndex].snippet);
        return; 
      }
      if (e.key === "Escape") { e.preventDefault(); setSuggestions([]); return; }
    }

    // 2. MD Shortcuts (Meta/Ctrl)
    if (e.metaKey || e.ctrlKey) {
      if (e.key === "s") { e.preventDefault(); saveNote(editTitle, editContent); return; }
      
      let prefix = "", suffix = "";
      if (e.key === "b") { prefix = "**"; suffix = "**"; }
      else if (e.key === "i") { prefix = "*"; suffix = "*"; }
      else if (e.key === "k") { prefix = "["; suffix = "](url)"; }
      else if (e.key === "l") { prefix = "- "; }
      
      if (prefix || suffix) {
        e.preventDefault();
        const before = value.substring(0, start);
        const selection = value.substring(start, end);
        const after = value.substring(end);
        const newValue = before + prefix + selection + suffix + after;
        setEditContent(newValue);
        setTimeout(() => { target.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
      }
    }
  };

  const handleEditorChange = (value: string) => {
    setEditContent(value);
    const cursor = textareaRef.current?.selectionStart || 0;
    const textBefore = value.substring(0, cursor);
    
    // Check for [[ triggers (Link)
    const lastOpen = textBefore.lastIndexOf("[[");
    if (lastOpen !== -1 && lastOpen >= textBefore.lastIndexOf("]]")) {
      const query = textBefore.substring(lastOpen + 2);
      const matched = notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(matched.slice(0, 5));
      setSuggestionType("link");
      setSelectedIndex(0);
      return;
    }

    // Check for / triggers (Slash)
    const lastSlash = textBefore.lastIndexOf("/");
    if (lastSlash !== -1 && (lastSlash === 0 || textBefore[lastSlash-1] === '\n' || textBefore[lastSlash-1] === ' ')) {
       const query = textBefore.substring(lastSlash + 1);
       if (!query.includes(' ')) {
          const matched = SLASH_COMMANDS.filter(c => c.id.includes(query.toLowerCase()));
          setSuggestions(matched);
          setSuggestionType("slash");
          setSelectedIndex(0);
          return;
       }
    }

    setSuggestions([]);
  };

  const insertLink = (title: string) => {
    if (!textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const textBefore = editContent.substring(0, cursor);
    const lastOpen = textBefore.lastIndexOf("[[");
    const before = editContent.substring(0, lastOpen);
    const after = editContent.substring(cursor);
    setEditContent(before + "[[" + title + "]]" + after);
    setSuggestions([]);
    textareaRef.current.focus();
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const textBefore = editContent.substring(0, cursor);
    const lastSlash = textBefore.lastIndexOf("/");
    const before = editContent.substring(0, lastSlash);
    const after = editContent.substring(cursor);
    setEditContent(before + snippet + after);
    setSuggestions([]);
    textareaRef.current.focus();
  };

  // Helper for toolbar buttons
  const applyMD = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const before = editContent.substring(0, start);
    const selection = editContent.substring(start, end);
    const after = editContent.substring(end);
    setEditContent(before + prefix + selection + suffix + after);
    textareaRef.current.focus();
    setTimeout(() => { textareaRef.current?.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
  };

  const downloadNote = () => {
    if (!activeNote) return;
    const blob = new Blob([editContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editTitle || "note"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    setMode("visual");
    // Ensure we are in visual mode before printing to avoid blank textarea
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleNoteLinkClick = (title: string) => {
    // Check if it's a direct title or type:title
    const cleanTitle = title.includes(':') ? title.split(':').slice(1).join(':').trim() : title.trim();
    const target = notes.find(n => n.title.toLowerCase() === cleanTitle.toLowerCase());
    if (target) {
       openNote(target);
    } else {
       console.log("Note not found:", cleanTitle);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkText = part.slice(2, -2);
        const [type, value] = linkText.includes(':') ? [linkText.split(':')[0], linkText.split(':').slice(1).join(':')] : ['note', linkText];
        let icon = <FileText size={14} className="opacity-60" />;
        let color = "text-primary border-primary/20 bg-primary/5 hover:bg-primary/10";
        if (type === 'task') { icon = <CheckSquare size={14} />; color = "text-orange-500 border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10"; }
        else if (type === 'dsa') { icon = <Target size={14} />; color = "text-cyan-500 border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10"; }

        return (
          <button 
            key={i} 
            onClick={() => handleNoteLinkClick(linkText)}
            className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-md font-semibold transition-all text-[10px] uppercase tracking-wider cursor-pointer active:scale-95", color)}
          >
            {icon} {value}
          </button>
        );
      }
      return part;
    });
  };

  // ... Graph Data Memo ...
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    notes.forEach((note, i) => {
      nodes.push({ id: note._id, label: note.title, x: Math.cos(i * (2 * Math.PI / notes.length)) * 200 + 400, y: Math.sin(i * (2 * Math.PI / notes.length)) * 200 + 400 });
      const matches = note.content.match(/\[\[(.*?)\]\]/g);
      if (matches) {
        matches.forEach(match => {
          const content = match.slice(2, -2);
          const title = content.includes(':') ? content.split(':').slice(1).join(':') : content;
          const target = notes.find(n => n.title.toLowerCase() === title.toLowerCase());
          if (target) links.push({ source: note._id, target: target._id });
        });
      }
    });

    return { nodes, links };
  }, [notes]);

  // ... Mode Transition Refinement ...
  return (
    <div className="flex h-full w-full bg-background relative selection:bg-primary/20 transition-colors duration-500 print:bg-white overflow-hidden">
      {/* 1. VAULT EXPLORER */}
      <AnimatePresence mode="wait">
        {!activeNote && (
          <motion.div 
            key="vault"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col h-full max-w-5xl mx-auto py-12 px-6 print:hidden"
          >
            <header className="flex items-end justify-between mb-10">
               <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tighter text-foreground">Vault</h1>
                  <p className="text-muted-foreground text-sm font-medium opacity-60">Synchronize your digital consciousness.</p>
               </div>
               <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setShowMap(true)} className="h-10 px-4 rounded-xl font-bold bg-surface border border-border/50 shadow-sm text-xs transition-all hover:scale-105 active:scale-95">
                    <MapIcon className="mr-2 h-3.5 w-3.5" /> Matrix
                  </Button>
                  <Button size="sm" onClick={createNote} className="h-10 px-6 rounded-xl font-black shadow-xl shadow-primary/20 text-xs transition-all hover:scale-105 active:scale-95">
                    <Plus className="mr-2 h-4 w-4" /> New Insight
                  </Button>
               </div>
            </header>

            <div className="relative mb-10 group">
               <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-2xl" />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
               <Input 
                 placeholder="Search your knowledge base..." 
                 className="relative pl-12 h-12 bg-surface/80 backdrop-blur-md border-border/50 rounded-2xl text-sm font-medium focus-visible:ring-primary/20 shadow-sm"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
               {notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map(n => (
                 <MotionCard
                   key={n._id}
                   onClick={() => openNote(n)}
                   whileHover={{ y: -6, shadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}
                   className="group bg-surface/40 hover:bg-surface border-border/50 hover:border-primary/30 rounded-3xl p-6 cursor-pointer transition-all flex flex-col h-[200px] shadow-sm relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight size={16} className="text-primary" />
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                       <FileText size={20} />
                    </div>
                    <h3 className="text-base font-black text-foreground mb-3 line-clamp-1 leading-tight group-hover:text-primary transition-colors">{n.title}</h3>
                    <p className="text-muted-foreground/70 text-xs line-clamp-3 leading-relaxed font-medium">{n.content.replace(/[#*`\[\]]/g, "").substring(0, 120) || "Empty insight..."}</p>
                 </MotionCard>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PRO DOCUMENT EDITOR (The 'Visual Flow' Workspace) */}
      <AnimatePresence>
         {activeNote && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.02 }}
               className="fixed inset-0 z-[100] bg-[#F9FAFB] dark:bg-[#09090B] flex flex-col overflow-hidden print:bg-white"
            >
               {/* High-Fidelity Floating Header */}
               <header className="h-16 shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-3xl flex items-center px-8 justify-between z-50 print:hidden shadow-sm">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                     <Button variant="ghost" onClick={() => setActiveNote(null)} className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:bg-muted transition-all active:scale-90">
                        <X size={22} />
                     </Button>
                     <div className="h-6 w-px bg-border/50 mx-1" />
                     <input 
                       value={editTitle}
                       onChange={(e) => setEditTitle(e.target.value)}
                       className="bg-transparent border-none outline-none text-lg font-black text-foreground flex-1 truncate placeholder:text-muted-foreground/10 focus:placeholder:text-muted-foreground/30 transition-all"
                       placeholder="Untitled Insight..."
                     />
                  </div>

                  {/* SMART TOOLBAR */}
                  <div className="hidden xl:flex items-center gap-1.5 px-5 py-2 border border-border/50 bg-surface/50 backdrop-blur-md rounded-2xl shadow-sm mx-6">
                     <button title="Bold (CMD+B)" onClick={() => applyMD("**", "**")} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-muted-foreground/80"><Bold size={18} /></button>
                     <button title="Italic (CMD+I)" onClick={() => applyMD("*", "*")} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-muted-foreground/80"><Italic size={18} /></button>
                     <button title="Link (CMD+K)" onClick={() => applyMD("[", "](url)")} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-muted-foreground/80"><LinkIcon size={18} /></button>
                     <div className="h-5 w-px bg-border/50 mx-2" />
                     <button title="Heading" onClick={() => applyMD("# ")} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-muted-foreground/80"><Heading1 size={18} /></button>
                     <button title="Table" onClick={() => applyMD("| C1 | C2 |\n|---|---|\n| .. | .. |")} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-muted-foreground/80"><TableIcon size={18} /></button>
                     <button title="Task List" onClick={() => applyMD("- [ ] ")} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-muted-foreground/80"><CheckSquare size={18} /></button>
                     <div className="h-5 w-px bg-border/50 mx-2" />
                     <button title="Download Markdown" onClick={downloadNote} className="p-2 hover:bg-emerald-500 hover:text-white rounded-lg transition-all text-muted-foreground/80"><Download size={18} /></button>
                     <button title="Export to PDF" onClick={exportPDF} className="p-2 hover:bg-emerald-500 hover:text-white rounded-lg transition-all text-muted-foreground/80"><FileDown size={18} /></button>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/50 bg-surface text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground shadow-sm">
                        {isSaving ? <Sparkles size={12} className="animate-pulse text-primary" /> : <CloudCheck size={12} className="text-emerald-500" />}
                        {isSaving ? "Syncing" : "Persisted"}
                     </div>
                     <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
                        <button onClick={() => setMode("markdown")} className={cn("px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", mode === "markdown" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground")}>Draft</button>
                        <button onClick={() => setMode("visual")} className={cn("px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", mode === "visual" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground")}>Visual</button>
                     </div>
                     <Button variant="ghost" onClick={() => deleteNote(activeNote._id)} className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                        <Trash size={20} />
                     </Button>
                  </div>
               </header>

               <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-16 px-6 selection:bg-primary/20 print:p-0 print:overflow-visible scroll-smooth">
                  {/* THE PAPER SHEET (The 'Pro-Space') */}
                  <motion.div 
                    layoutId="paper-sheet"
                    className="w-full max-w-4xl min-h-[92vh] bg-surface shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] rounded-xl border border-border/50 p-14 md:p-24 relative flex flex-col print:shadow-none print:border-none print:max-w-none print:min-h-0 print:p-0 transition-shadow duration-700"
                  >
                     {/* Print-only title */}
                     <h1 className="hidden print:block text-5xl font-black mb-16 border-b-4 border-black pb-6 tracking-tighter">{editTitle}</h1>

                     <AnimatePresence mode="wait">
                        {mode === "markdown" ? (
                           <motion.div 
                             key="editor"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="relative flex-1 flex flex-col print:hidden"
                           >
                              <AnimatePresence>
                                 {suggestions.length > 0 && (
                                    <motion.div 
                                       initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                       animate={{ opacity: 1, scale: 1, y: 0 }}
                                       exit={{ opacity: 0, scale: 0.95 }}
                                       className="absolute left-0 bottom-full mb-6 z-[110] w-80 bg-surface/90 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1 ring-1 ring-primary/5"
                                    >
                                       <div className="px-4 py-2 border-b border-border/50 mb-1 flex items-center justify-between">
                                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                             {suggestionType === "link" ? <Command size={12} /> : <Sparkles size={12} />}
                                             {suggestionType === "link" ? "Link Logic" : "System Action"}
                                          </span>
                                          <span className="text-[9px] text-muted-foreground font-bold">TAB to select</span>
                                       </div>
                                       {suggestions.map((s, i) => (
                                          <button 
                                             key={s._id || s.id}
                                             onClick={() => suggestionType === "link" ? insertLink(s.title) : insertSnippet(s.snippet)}
                                             className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between transition-all group",
                                                i === selectedIndex ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-primary/5 text-muted-foreground"
                                             )}
                                          >
                                             <div className="flex items-center gap-3">
                                                {suggestionType === "slash" && <div className={cn("opacity-70 group-hover:scale-110 transition-transform", i === selectedIndex ? "text-white" : "text-primary")}>{s.icon}</div>}
                                                <span className="text-xs font-bold tracking-tight truncate">{s.title}</span>
                                             </div>
                                          </button>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>

                              <textarea 
                                 ref={textareaRef}
                                 value={editContent}
                                 onChange={(e) => handleEditorChange(e.target.value)}
                                 onKeyDown={handleEditorKeyDown}
                                 placeholder="Pour your thoughts onto the paper..."
                                 className="w-full h-full min-h-[65vh] bg-transparent outline-none text-lg font-medium text-foreground tracking-tight leading-[2] placeholder:text-muted-foreground/10 resize-none font-sans transition-all duration-300 focus:placeholder:text-muted-foreground/20"
                                 spellCheck={false}
                              />
                           </motion.div>
                        ) : (
                           <motion.div 
                             key="preview"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="prose prose-neutral dark:prose-invert prose-lg max-w-none antialiased print:prose-black print:text-black"
                           >
                              <ReactMarkdown
                                 remarkPlugins={[remarkGfm]}
                                 components={{
                                   h1: ({...props}) => <h1 className="text-4xl font-black tracking-tighter mb-14 text-foreground border-b-2 border-border/30 pb-4" {...props} />,
                                   h2: ({...props}) => <h2 className="text-2xl mt-20 mb-8 font-black tracking-tight text-foreground/90 flex items-center gap-4 before:h-px before:w-8 before:bg-primary/20" {...props} />,
                                   h3: ({...props}) => <h3 className="text-xl mt-14 mb-5 font-black tracking-tight text-foreground/80" {...props} />,
                                   p: ({children}) => <p className="leading-[2] mb-10 text-muted-foreground/90 font-medium text-lg selection:bg-primary/30">{typeof children === 'string' ? renderContent(children) : children}</p>,
                                   code: ({...props}) => <code className="bg-primary/5 px-2 py-0.5 rounded-lg font-mono text-sm text-primary font-bold border border-primary/10" {...props} />,
                                   pre: ({...props}) => <pre className="p-10 rounded-3xl border border-border/50 bg-[#0A0A0C] shadow-2xl my-12 overflow-x-auto ring-1 ring-white/5 print:bg-white print:text-black print:border" {...props} />,
                                   blockquote: ({...props}) => <blockquote className="border-l-4 border-primary/40 bg-primary/[0.02] p-10 rounded-2xl my-12 italic text-muted-foreground/80 font-medium leading-relaxed shadow-sm print:bg-transparent print:border-l-4 print:border-gray-200" {...props} />,
                                   img: ({...props}) => (
                                      <span className="block my-16 text-center group/img">
                                         <img 
                                           className="mx-auto block max-w-full rounded-2xl shadow-xl border border-border/50 transition-all group-hover/img:scale-[1.01] group-hover/img:shadow-2xl print:shadow-none print:border-none" 
                                           {...props} 
                                         />
                                         {props.alt && <span className="block mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 px-10 leading-relaxed">{props.alt}</span>}
                                      </span>
                                   ),
                                   table: ({...props}) => <div className="overflow-x-auto my-12 rounded-2xl border border-border/50 shadow-sm"><table className="w-full border-collapse" {...props} /></div>,
                                   th: ({...props}) => <th className="p-5 bg-muted/40 font-black text-[11px] uppercase tracking-[0.2em] text-left border-b border-border/50" {...props} />,
                                   td: ({...props}) => <td className="p-5 border-b border-border/10 text-sm font-medium" {...props} />,
                                   ul: ({...props}) => <ul className="space-y-4 mb-10 list-none pl-2" {...props} />,
                                   li: ({children}) => <li className="flex items-start gap-4 text-lg text-muted-foreground/90 font-medium leading-[2] before:mt-[0.6em] before:h-2 before:w-2 before:rounded-full before:bg-primary/30 shrink-0">{children}</li>,
                                 }}
                               >
                                 {editContent}
                              </ReactMarkdown>
                           </motion.div>
                        )}
                     </AnimatePresence>
                     
                     <div className="mt-24 pt-12 border-t border-border/20 opacity-20 pointer-events-none print:hidden">
                        <div className="h-6 w-full flex gap-4 items-center">
                           <div className="h-2 w-32 bg-muted rounded-full" />
                           <div className="h-2 w-full bg-muted/50 rounded-full" />
                           <Sparkles size={14} className="text-primary/40" />
                        </div>
                     </div>
                  </motion.div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* MATRIX GRAPH MODAL */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-3xl flex flex-col print:hidden">
             <header className="h-24 flex items-center justify-between px-12 border-b border-border/50">
                <div className="flex items-center gap-6">
                   <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40"><MapIcon size={24} /></div>
                   <div>
                      <h2 className="text-2xl font-black tracking-tight">Knowledge Matrix</h2>
                      <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-40">Visualization across your neural net</p>
                   </div>
                </div>
                <Button variant="ghost" onClick={() => setShowMap(false)} className="rounded-2xl h-12 w-12 p-0 text-muted-foreground hover:bg-muted transition-all active:scale-90"><X size={28} /></Button>
             </header>
             <div className="flex-1 relative flex items-center justify-center">
                <svg className="w-full h-full max-w-6xl max-h-[80vh]" viewBox="0 -80 800 880">
                   <defs>
                      <filter id="glow">
                         <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                         <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                         </feMerge>
                      </filter>
                   </defs>
                   <g>
                      {graphData.links.map((link, i) => {
                         const source = graphData.nodes.find(n => n.id === link.source);
                         const target = graphData.nodes.find(n => n.id === link.target);
                         if (!source || !target) return null;
                         return <motion.line initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} key={i} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" className="text-primary/30" />;
                      })}
                      {graphData.nodes.map((node) => (
                         <motion.g key={node.id} whileHover={{ scale: 1.15 }} onClick={() => { setShowMap(false); openNote(notes.find(n => n._id === node.id)!); }} className="cursor-pointer group">
                            <circle cx={node.x} cy={node.y} r="22" className="fill-background stroke-primary/10 stroke-[4] shadow-2xl transition-all group-hover:stroke-primary" />
                            <circle cx={node.x} cy={node.y} r="8" className="fill-primary" filter="url(#glow)" />
                            <text x={node.x} y={node.y + 50} className="text-[12px] font-black fill-foreground/60 group-hover:fill-primary text-center uppercase tracking-[0.2em] antialiased transition-colors" textAnchor="middle">{node.label}</text>
                         </motion.g>
                      ))}
                   </g>
                </svg>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media print {
          /* SURGICAL PRINT STRATEGY */
          body > *:not(.print-container) { display: none !important; }
          .fixed.inset-0.z-\[100\] { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            display: block !important; 
            overflow: visible !important; 
            background: white !important;
            height: auto !important;
            z-index: auto !important;
          }
          nav, header, button, footer, .print-hide, .framer-motion-overlay { 
            display: none !important; 
            visibility: hidden !important;
          }
          .print-area {
            margin: 0 !important;
            padding: 2cm !important;
            box-shadow: none !important;
            border: none !important;
            max-width: none !important;
            width: 100% !important;
            min-height: 0 !important;
          }
          /* Re-enable display for critical content */
          body * { visibility: visible; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--foreground-rgb), 0.05); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--foreground-rgb), 0.15); }
      `}</style>
    </div>
  );
}
