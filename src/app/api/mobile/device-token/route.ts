import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getHybridUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const sessionUser = await getHybridUser(req);
    if (!sessionUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { deviceToken } = body;

    if (!deviceToken) {
      return NextResponse.json({ message: "deviceToken is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Save the Firebase Cloud Messaging token for this Android user
    await User.findByIdAndUpdate(sessionUser.id, { deviceToken });

    return NextResponse.json({ success: true, message: "Device token saved successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
