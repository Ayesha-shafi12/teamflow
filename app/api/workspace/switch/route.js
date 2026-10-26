import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await request.json();

    if (!mongoose.isValidObjectId(workspaceId)) {
      return Response.json({ error: "Workspace not found" }, { status: 404 });
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": session.userId,
    }).select("_id");

    if (!workspace) {
      return Response.json({ error: "Workspace not found" }, { status: 404 });
    }

    await User.updateOne(
      { _id: session.userId },
      { activeWorkspace: workspace._id },
    );

    return Response.json({ message: "Workspace switched" });
  } catch (error) {
    console.error("Switch workspace error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
