import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      {
        message: "Account created",
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.code === 11000) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    console.error("Register error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
