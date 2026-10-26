import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { logActivity } from "@/lib/activity";
import User from "@/models/User";
import Task from "@/models/Task";

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const workspace = await getCurrentWorkspace(session);

    if (workspace.owner.toString() !== session.userId) {
      return Response.json(
        { error: "Only the workspace owner can add members" },
        { status: 403 },
      );
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        {
          error:
            "No TeamFlow account uses this email. Ask them to sign up first.",
        },
        { status: 404 },
      );
    }

    const alreadyMember = workspace.members.some(
      (member) => member.user.toString() === user._id.toString(),
    );

    if (alreadyMember) {
      return Response.json(
        { error: "This person is already a member" },
        { status: 409 },
      );
    }

    workspace.members.push({ user: user._id, role: "member" });
    await workspace.save();

    await logActivity({
      workspace: workspace._id,
      actor: session.userId,
      type: "member_added",
      details: { memberName: user.name },
    });

    return Response.json(
      { member: { id: user._id, name: user.name, email: user.email } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add member error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!mongoose.isValidObjectId(userId)) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    const workspace = await getCurrentWorkspace(session);

    if (workspace.owner.toString() !== session.userId) {
      return Response.json(
        { error: "Only the workspace owner can remove members" },
        { status: 403 },
      );
    }

    if (workspace.owner.toString() === userId) {
      return Response.json(
        { error: "The owner can't be removed" },
        { status: 400 },
      );
    }

    const before = workspace.members.length;
    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== userId,
    );

    if (workspace.members.length === before) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    const removedUser = await User.findById(userId).select("name").lean();

    await workspace.save();

    await Promise.all([
      Task.updateMany(
        { workspace: workspace._id, assignee: userId },
        { assignee: null },
      ),
      User.updateOne(
        { _id: userId, activeWorkspace: workspace._id },
        { activeWorkspace: null },
      ),
    ]);

    await logActivity({
      workspace: workspace._id,
      actor: session.userId,
      type: "member_removed",
      details: { memberName: removedUser?.name ?? "a member" },
    });

    return Response.json({ message: "Member removed" });
  } catch (error) {
    console.error("Remove member error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
