import mongoose from "mongoose";
import Project from "@/models/Project";

export async function getProjectInWorkspace(projectId, workspaceId) {
  if (!mongoose.isValidObjectId(projectId)) {
    return null;
  }

  return Project.findOne({ _id: projectId, workspace: workspaceId }).lean();
}
