"use client";

import { useEffect, useState, use } from "react";
import { ChevronLeft, Edit2, Trash2, ExternalLink, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DSAModal } from "@/components/dsa/DSAModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface Solution {
  approach: "brute" | "better" | "optimal";
  code: string;
  explanation: string;
  language: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface DSANote {
  _id: string;
  title: string;
  type: "problem" | "theory";
  problemLink?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  status?: "Solved" | "Attempted" | "Revisit";
  category?: string;
  problemStatement?: string;
  notes?: string;
  theoryContent?: string;
  solutions: Solution[];
  updatedAt: string;
}

export default function DSADetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<DSANote | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeApproach, setActiveApproach] = useState<"brute" | "better" | "optimal">("optimal");
  const [activeTab, setActiveTab] = useState<"problem" | "solutions" | "notes">("problem");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/dsa/${id}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data);
        if (data.type === "problem" && data.solutions?.length > 0) {
          // Default to the best approach available
          const hasOptimal = data.solutions.find((s: any) => s.approach === "optimal");
          const hasBetter = data.solutions.find((s: any) => s.approach === "better");
          setActiveApproach(hasOptimal ? "optimal" : hasBetter ? "better" : "brute");
        }
      } else {
        router.push("/dashboard/dsa");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/dsa/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchNote();
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this dsa entry?")) {
      const res = await fetch(`/api/dsa/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/dsa");
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-muted-foreground font-medium">Analyzing solution...</div>;
  if (!note) return null;

  const currentSolution = note.solutions?.find(s => s.approach === activeApproach);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/dsa">
            <Button variant="ghost" size="sm" className="group h-10 w-10 p-0 rounded-full bg-surface border border-border">
              <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground line-clamp-1">{note.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {note.type === "problem" ? (
                <>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    note.difficulty === "Easy" ? "text-green-500" :
                    note.difficulty === "Medium" ? "text-orange-500" : "text-red-500"
                  )}>
                    {note.difficulty}
                  </span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    note.status === "Solved" ? "text-primary" :
                    note.status === "Revisit" ? "text-yellow-500" : "text-muted-foreground"
                  )}>
                    {note.status || "Attempted"}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Theory</span>
              )}
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">{note.category || "Uncategorized"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {note.problemLink && (
            <a href={note.problemLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-9 rounded-xl">
                LeetCode <ExternalLink size={14} className="ml-2 opacity-60" />
              </Button>
            </a>
          )}
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl text-red-500" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      {note.type === "theory" ? (
        <div className="px-4 sm:px-0">
          <article className="prose prose-invert max-w-none bg-surface p-6 sm:p-10 rounded-3xl border border-border shadow-sm">
            <ReactMarkdown>{note.theoryContent || ""}</ReactMarkdown>
          </article>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-0 h-full lg:h-[calc(100vh-220px)]">
          {/* Mobile Tabs */}
          <div className="lg:hidden flex p-1 bg-surface border border-border rounded-xl">
            {(["problem", "solutions", "notes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                  activeTab === tab ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Left Panel: Content */}
          <div className={cn(
            "flex flex-col gap-6 lg:flex overflow-y-auto custom-scrollbar pr-0 lg:pr-4",
            activeTab !== "problem" && activeTab !== "notes" && "hidden lg:flex"
          )}>
            <div className="space-y-6 flex-1">
              {/* Problem/Statement Section */}
              <div className={cn(
                "bg-surface rounded-3xl border border-border overflow-hidden flex flex-col min-h-0",
                activeTab === "notes" && "hidden lg:flex"
              )}>
                <div className="px-6 py-4 border-b border-border bg-surface-hover/30 flex items-center justify-between shrink-0">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                     <BookOpen size={16} className="text-primary" />
                     Problem Description
                  </h3>
                </div>
                <div className="p-6 prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed overflow-y-auto">
                  <ReactMarkdown>{note.problemStatement || "_No problem description provided._"}</ReactMarkdown>
                </div>
              </div>

              {/* Notes/Takeaways Section */}
              <div className={cn(
                "bg-surface rounded-3xl border border-border overflow-hidden flex flex-col min-h-0",
                activeTab === "problem" && "hidden lg:flex"
              )}>
                <div className="px-6 py-4 border-b border-border bg-surface-hover/30 shrink-0">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                     <Clock size={16} className="text-primary" />
                     Key Learnings & Notes
                  </h3>
                </div>
                <div className="p-6 prose prose-invert max-w-none text-sm text-muted-foreground overflow-y-auto">
                  <ReactMarkdown>{note.notes || "_Add your key takeaways, time complexity thoughts, or patterns learned here._"}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Code & Complexity */}
          <div className={cn(
            "flex flex-col gap-6 lg:flex overflow-y-auto custom-scrollbar",
            activeTab !== "solutions" && "hidden lg:flex"
          )}>
            <div className="flex flex-col gap-6 h-full">
              {/* Approach Selector */}
              <div className="flex flex-wrap p-1.5 bg-surface border border-border rounded-2xl w-fit">
                {["brute", "better", "optimal"].map((approach) => {
                  const solution = note.solutions?.find(s => s.approach === approach);
                  const isActive = activeApproach === approach;
                  return (
                    <button
                      key={approach}
                      onClick={() => setActiveApproach(approach as any)}
                      disabled={!solution}
                      className={cn(
                        "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 relative",
                        isActive 
                          ? "bg-background text-primary shadow-sm" 
                          : solution 
                            ? "text-muted-foreground hover:text-foreground" 
                            : "text-muted-foreground/20 cursor-not-allowed"
                      )}
                    >
                      {approach}
                    </button>
                  );
                })}
              </div>

              {/* Code Editor/Viewer */}
              <div className="bg-[#1e1e1e] rounded-3xl border border-border overflow-hidden shadow-2xl flex flex-col flex-1 min-h-[300px]">
                <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {currentSolution?.language || "javascript"}
                  </span>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <SyntaxHighlighter
                    language={currentSolution?.language || "javascript"}
                    style={oneDark}
                    customStyle={{ 
                      margin: 0, 
                      padding: '24px', 
                      fontSize: '13px', 
                      lineHeight: '1.7',
                      background: 'transparent'
                    }}
                  >
                    {currentSolution?.code || "// No code available"}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Complexity & Explanation Section */}
              <div className="bg-surface rounded-3xl border border-border overflow-hidden shrink-0">
                 <div className="grid grid-cols-2 border-b border-border">
                    <div className="p-4 border-r border-border flex flex-col items-center justify-center gap-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Time Complexity</span>
                      <span className="text-sm font-mono text-primary font-bold">{currentSolution?.timeComplexity || "O(?)"}</span>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center gap-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Space Complexity</span>
                      <span className="text-sm font-mono text-primary font-bold">{currentSolution?.spaceComplexity || "O(?)"}</span>
                    </div>
                 </div>
                 <div className="p-6 text-sm text-muted-foreground leading-relaxed">
                    <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Strategy</h4>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{currentSolution?.explanation || "No explanation provided."}</ReactMarkdown>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DSAModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleUpdate} 
        initialData={note}
      />
    </div>
  );
}
