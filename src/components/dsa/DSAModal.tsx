"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface Solution {
  approach: "brute" | "better" | "optimal";
  code: string;
  explanation: string;
  language: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface DSANotePayload {
  type: "problem" | "theory";
  title: string;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  status?: "Solved" | "Attempted" | "Revisit";
  problemLink?: string;
  problemStatement?: string;
  notes?: string;
  theoryContent?: string;
  solutions: Solution[];
}

interface DSAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<DSANotePayload>) => Promise<void>;
  initialData?: any;
}

export function DSAModal({ isOpen, onClose, onSave, initialData }: DSAModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"problem" | "theory">("problem");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [status, setStatus] = useState<"Solved" | "Attempted" | "Revisit">("Attempted");
  const [problemLink, setProblemLink] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [notes, setNotes] = useState("");
  const [theoryContent, setTheoryContent] = useState("");
  const [solutions, setSolutions] = useState<Solution[]>([
    { approach: "brute", code: "", explanation: "", language: "javascript", timeComplexity: "", spaceComplexity: "" },
    { approach: "better", code: "", explanation: "", language: "javascript", timeComplexity: "", spaceComplexity: "" },
    { approach: "optimal", code: "", explanation: "", language: "javascript", timeComplexity: "", spaceComplexity: "" },
  ]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "problem");
      setTitle(initialData.title || "");
      setCategory(initialData.category || "");
      setDifficulty(initialData.difficulty || "Medium");
      setStatus(initialData.status || "Attempted");
      setProblemLink(initialData.problemLink || "");
      setProblemStatement(initialData.problemStatement || "");
      setNotes(initialData.notes || "");
      setTheoryContent(initialData.theoryContent || "");
      if (initialData.solutions?.length > 0) {
        setSolutions(initialData.solutions);
      }
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setType("problem");
    setTitle("");
    setCategory("");
    setDifficulty("Medium");
    setStatus("Attempted");
    setProblemLink("");
    setProblemStatement("");
    setNotes("");
    setTheoryContent("");
    setSolutions([
      { approach: "brute", code: "", explanation: "", language: "javascript", timeComplexity: "", spaceComplexity: "" },
      { approach: "better", code: "", explanation: "", language: "javascript", timeComplexity: "", spaceComplexity: "" },
      { approach: "optimal", code: "", explanation: "", language: "javascript", timeComplexity: "", spaceComplexity: "" },
    ]);
  };

  const handleSolutionChange = (index: number, field: keyof Solution, value: string) => {
    const newSolutions = [...solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    setSolutions(newSolutions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Partial<DSANotePayload> = {
        type,
        title,
        category,
        difficulty: type === "problem" ? difficulty : undefined,
        status: type === "problem" ? status : undefined,
        problemLink: type === "problem" ? problemLink : undefined,
        problemStatement: type === "problem" ? problemStatement : undefined,
        notes: type === "problem" ? notes : undefined,
        theoryContent: type === "theory" ? theoryContent : undefined,
        solutions: type === "problem" ? solutions.filter(s => s.code || s.explanation) : [],
      };
      await onSave(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-surface border border-border rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold tracking-tight">{initialData ? "Edit Entry" : "New DSA Entry"}</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-full transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="flex p-1 bg-background rounded-lg max-w-xs">
                <button
                  type="button"
                  onClick={() => setType("problem")}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all",
                    type === "problem" ? "bg-surface shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Code size={16} />
                  <span>Problem</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType("theory")}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all",
                    type === "theory" ? "bg-surface shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText size={16} />
                  <span>Theory</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <Input placeholder="e.g. Two Sum" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <Input placeholder="e.g. Arrays, DP" value={category} onChange={(e) => setCategory(e.target.value)} />
                  </div>
                </div>

                {type === "problem" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as "Solved" | "Attempted" | "Revisit")}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="Solved">Solved</option>
                        <option value="Attempted">Attempted</option>
                        <option value="Revisit">Revisit</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">LeetCode Link</label>
                      <Input placeholder="https://leetcode.com/problems/..." value={problemLink} onChange={(e) => setProblemLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {type === "problem" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Problem Description (Markdown)</label>
                    <textarea
                      placeholder="Paste problem description here..."
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      className="w-full min-h-[150px] bg-background border border-border rounded-xl p-4 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Personal Notes/Takeaways</label>
                    <textarea
                      placeholder="What did you learn from this?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[150px] bg-background border border-border rounded-xl p-4 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {type === "theory" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Theory Content (Markdown)</label>
                  <textarea
                    placeholder="Write your theory notes here..."
                    value={theoryContent}
                    onChange={(e) => setTheoryContent(e.target.value)}
                    className="w-full min-h-[300px] bg-background border border-border rounded-xl p-4 text-sm focus:outline-none font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold border-b border-border pb-2">Solutions & Approaches</h3>
                  {solutions.map((sol, idx) => (
                    <div key={sol.approach} className="space-y-4 p-6 border border-border/50 rounded-2xl bg-background/30 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-sm font-bold uppercase tracking-wider text-primary">{sol.approach} Approach</span>
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Time: O(n)" 
                            value={sol.timeComplexity} 
                            onChange={(e) => handleSolutionChange(idx, "timeComplexity", e.target.value)}
                            className="h-8 text-[10px] w-24"
                          />
                          <Input 
                            placeholder="Space: O(1)" 
                            value={sol.spaceComplexity} 
                            onChange={(e) => handleSolutionChange(idx, "spaceComplexity", e.target.value)}
                            className="h-8 text-[10px] w-24"
                          />
                          <select
                            value={sol.language}
                            onChange={(e) => handleSolutionChange(idx, "language", e.target.value)}
                            className="bg-surface border border-border text-[10px] rounded px-2 py-1 h-8"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Strategy / Explanation</label>
                          <textarea
                            placeholder="Describe the logic..."
                            value={sol.explanation}
                            onChange={(e) => handleSolutionChange(idx, "explanation", e.target.value)}
                            className="w-full min-h-[150px] bg-background border border-border rounded-lg p-3 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Solution Code</label>
                          <textarea
                            placeholder="Paste code..."
                            value={sol.code}
                            onChange={(e) => handleSolutionChange(idx, "code", e.target.value)}
                            className="w-full min-h-[150px] bg-surface-hover/30 border border-border rounded-lg p-3 text-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            <div className="p-6 border-t border-border bg-background flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : initialData ? "Update Entry" : "Create Entry"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
