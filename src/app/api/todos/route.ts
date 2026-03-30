import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Todo from "@/models/Todo";
import { getHybridUser } from "@/lib/session";
import { todoSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const todos = await Todo.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = todoSchema.parse(body);

    await connectToDatabase();
    const todo = await Todo.create({
      ...parsed,
      userId: user.id,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
