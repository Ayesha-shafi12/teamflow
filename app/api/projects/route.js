import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { PROJECT_COLORS } from "@/lib/project-colors";
import { logActivity } from "@/lib/activity";
import Project from "@/models/Project";

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return Response.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    if (trimmedName.length > 100) {
      return Response.json(
        { error: "Project name must be 100 characters or less" },
        { status: 400 },
      );
    }

    const workspace = await getCurrentWorkspace(session);
    const count = await Project.countDocuments({ workspace: workspace._id });

    const project = await Project.create({
      name: trimmedName,
      description: description?.trim() || "",
      color: PROJECT_COLORS[count % PROJECT_COLORS.length],
      workspace: workspace._id,
      createdBy: session.userId,
    });

    await logActivity({
      workspace: workspace._id,
      actor: session.userId,
      type: "project_created",
      project: project._id,
      details: { projectName: project.name },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
