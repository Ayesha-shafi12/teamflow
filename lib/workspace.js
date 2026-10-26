import { cache } from "react";
import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import User from "@/models/User";

const loadWorkspace = cache(async (userId, name) => {
  await connectDB();

  const user = await User.findById(userId).select("activeWorkspace").lean();

  if (user?.activeWorkspace) {
    const active = await Workspace.findOne({
      _id: user.activeWorkspace,
      "members.user": userId,
    });

    if (active) return active;
  }

  let workspace = await Workspace.findOne({ "members.user": userId }).sort({
    createdAt: 1,
  });

  if (!workspace) {
    const firstName = name.split(" ")[0];

    workspace = await Workspace.create({
      name: `${firstName}'s Workspace`,
      owner: userId,
      members: [{ user: userId, role: "owner" }],
    });
  }

  await User.updateOne({ _id: userId }, { activeWorkspace: workspace._id });

  return workspace;
});

export function getCurrentWorkspace(session) {
  return loadWorkspace(session.userId, session.name);
}

export async function getUserWorkspaces(userId) {
  await connectDB();

  const workspaces = await Workspace.find({ "members.user": userId })
    .select("name")
    .sort({ createdAt: 1 })
    .lean();

  return workspaces.map((workspace) => ({
    id: workspace._id.toString(),
    name: workspace.name,
  }));
}
