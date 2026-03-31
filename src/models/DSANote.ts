import mongoose, { Schema, Document } from 'mongoose';

export interface Solution {
  approach: "brute" | "better" | "optimal";
  code: string;
  explanation: string;
  language: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface IDSANote extends Document {
  userId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const solutionSchema = new mongoose.Schema({
  approach: { type: String, enum: ["brute", "better", "optimal"], required: true },
  code: { type: String, required: true },
  explanation: { type: String, required: true },
  language: { type: String, default: "javascript" },
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
});

const DSANoteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["problem", "theory"], required: true },
    problemLink: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    status: { type: String, enum: ["Solved", "Attempted", "Revisit"], default: "Attempted" },
    category: { type: String },
    problemStatement: { type: String },
    notes: { type: String },
    theoryContent: { type: String },
    solutions: [solutionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.DSANote || mongoose.model<IDSANote>('DSANote', DSANoteSchema);
