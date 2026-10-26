import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { STATUS_VALUES } from "@/lib/task-options";
import { logActivity } from "@/lib/activity";
import Project from "@/models/Project";
import Task from "@/models/Task";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const { status } = await request.json();

    if (!STATUS_VALUES.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const workspace = await getCurrentWorkspace(session);

    const task = await Task.findOne({ _id: id, workspace: workspace._id });

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const fromStatus = task.status;

    if (fromStatus === status) {
      return Response.json({ task });
    }

    task.status = status;
    await task.save();

    const project = await Project.findByIdAndUpdate(
      task.project,
      { updatedAt: new Date() },
      { new: true },
    )
      .select("name")
      .lean();

    await logActivity({
      workspace: workspace._id,
      actor: session.userId,
      type: "task_moved",
      project: task.project,
      details: {
        taskTitle: task.title,
        projectName: project?.name,
        fromStatus,
        toStatus: status,
      },
    });

    return Response.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
