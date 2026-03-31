import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  category: 'task' | 'dsa';
  problemLink?: string;
  deadline?: Date;
  notified3h: boolean;
  notified10m: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    category: { type: String, enum: ['task', 'dsa'], default: 'task' },
    problemLink: { type: String },
    deadline: { type: Date },
    notified3h: { type: Boolean, default: false },
    notified10m: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
