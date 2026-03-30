import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Note from "@/models/Note";
import { getCurrentUser } from "@/lib/session";
import { noteSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const notes = await Note.find({ userId: user.id }).sort({ updatedAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = noteSchema.parse(body);

    await connectToDatabase();
    const note = await Note.create({
      ...parsed,
      userId: user.id,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
