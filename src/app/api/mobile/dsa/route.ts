import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import DSANote from "@/models/DSANote";
import { getMobileUser } from "@/lib/session";
import { dsaSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const user = await getMobileUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const dsaNotes = await DSANote.find({ userId: user.id }).sort({ updatedAt: -1 });

    return NextResponse.json(dsaNotes);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getMobileUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = dsaSchema.parse(body);

    await connectToDatabase();
    const dsaNote = await DSANote.create({
      ...parsed,
      userId: user.id,
    });

    return NextResponse.json(dsaNote, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", errors: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
