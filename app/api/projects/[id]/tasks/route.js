import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getProjectInWorkspace } from "@/lib/projects";
import { STATUS_VALUES, PRIORITY_VALUES } from "@/lib/task-options";
import { logActivity } from "@/lib/activity";
import Project from "@/models/Project";
import Task from "@/models/Task";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getCurrentWorkspace(session);
    const project = await getProjectInWorkspace(id, workspace._id);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const { title, description, priority, status, dueDate, assignee } =
      await request.json();
    const trimmedTitle = title?.trim();

    if (!trimmedTitle) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 },
      );
    }

    if (priority && !PRIORITY_VALUES.includes(priority)) {
      return Response.json({ error: "Invalid priority" }, { status: 400 });
    }

    if (status && !STATUS_VALUES.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
      return Response.json({ error: "Invalid due date" }, { status: 400 });
    }

    if (assignee) {
      const isMember = workspace.members.some(
        (member) => member.user.toString() === assignee,
      );

      if (!isMember) {
        return Response.json(
          { error: "Assignee must be a workspace member" },
          { status: 400 },
        );
      }
    }

    const task = await Task.create({
      title: trimmedTitle,
      description: description?.trim() || "",
      priority: priority || "medium",
      status: status || "todo",
      dueDate: dueDate ? new Date(dueDate) : null,
      assignee: assignee || null,
      project: project._id,
      workspace: workspace._id,
      createdBy: session.userId,
    });

    await Project.updateOne({ _id: project._id }, { updatedAt: new Date() });

    await logActivity({
      workspace: workspace._id,
      actor: session.userId,
      type: "task_created",
      project: project._id,
      details: { taskTitle: task.title, projectName: project.name },
    });

    return Response.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
