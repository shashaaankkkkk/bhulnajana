import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Todo from "@/models/Todo";
import { getCurrentUser } from "@/lib/session";
import { todoSchema } from "@/lib/validations";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const body = await req.json();
    const parsed = todoSchema.parse(body);

    await connectToDatabase();
    const todo = await Todo.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { ...parsed },
      { new: true }
    );

    if (!todo) return NextResponse.json({ message: "Todo not found" }, { status: 404 });

    return NextResponse.json(todo);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    await connectToDatabase();
    const todo = await Todo.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!todo) return NextResponse.json({ message: "Todo not found" }, { status: 404 });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
