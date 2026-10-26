import { NextResponse } from "next/server";
import { getSession, createToken, COOKIE_NAME } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (trimmedName.length > 60) {
      return NextResponse.json(
        { error: "Name must be 60 characters or less" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      { name: trimmedName },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = await createToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    const response = NextResponse.json({ message: "Profile updated" });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
