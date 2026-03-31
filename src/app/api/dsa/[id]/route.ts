import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import DSANote from "@/models/DSANote";
import { getHybridUser } from "@/lib/session";
import { dsaSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    await connectToDatabase();
    const dsaNote = await DSANote.findOne({ _id: params.id, userId: user.id });

    if (!dsaNote) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json(dsaNote);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const body = await req.json();
    const parsed = dsaSchema.parse(body);

    await connectToDatabase();
    const dsaNote = await DSANote.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { ...parsed },
      { new: true, runValidators: true }
    );

    if (!dsaNote) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json(dsaNote);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", errors: (error as any).errors }, { status: 400 });
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
    const dsaNote = await DSANote.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!dsaNote) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
