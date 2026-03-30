import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = registerSchema.parse(body);

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    // Generate JWT for React Native immediately upon registration
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      process.env.NEXTAUTH_SECRET || "default_secret",
      { expiresIn: "30d" }
    );

    return NextResponse.json({ 
      token, 
      user: { id: user._id, email: user.email, name: user.name } 
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 });
    }
    console.error("Registration Error: ", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
