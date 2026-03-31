import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "completed"]).optional(),
  deadline: z.string().optional().nullable(),
});

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const solutionSchema = z.object({
  approach: z.enum(["brute", "better", "optimal"]),
  code: z.string().optional().or(z.literal("")),
  explanation: z.string().optional().or(z.literal("")),
  language: z.string().default("javascript"),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
});

export const dsaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["problem", "theory"]),
  problemLink: z.string().url().optional().or(z.literal("")),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  status: z.enum(["Solved", "Attempted", "Revisit"]).optional(),
  category: z.string().optional(),
  problemStatement: z.string().optional(),
  notes: z.string().optional(),
  theoryContent: z.string().optional(),
  solutions: z.array(solutionSchema).optional(),
});
