import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getHybridUser } from "@/lib/session";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    const sessionUser = await getHybridUser(req);
    if (!sessionUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    // Exclude password and deviceToken for basic profile viewing
    const user = await User.findById(sessionUser.id).select("-password -deviceToken");
    
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const sessionUser = await getHybridUser(req);
    if (!sessionUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, email, password } = body;

    await connectToDatabase();
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
       updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      updateData,
      { new: true }
    ).select("-password -deviceToken");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
