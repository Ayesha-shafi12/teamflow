import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    const isValid = user && (await bcrypt.compare(password, user.password));

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = await createToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
