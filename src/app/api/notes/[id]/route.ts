import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Note from "@/models/Note";
import { getHybridUser } from "@/lib/session";
import { noteSchema } from "@/lib/validations";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const body = await req.json();
    const parsed = noteSchema.parse(body);

    await connectToDatabase();
    const note = await Note.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { ...parsed },
      { new: true }
    );

    if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json(note);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    await connectToDatabase();
    const note = await Note.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
