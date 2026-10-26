import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: "Both passwords are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    if (newPassword === currentPassword) {
      return Response.json(
        { error: "New password must be different from the current one" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(session.userId).select("+password");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return Response.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return Response.json({ message: "Password updated" });
  } catch (error) {
    console.error("Change password error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
