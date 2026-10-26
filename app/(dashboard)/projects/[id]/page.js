import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getProjectInWorkspace } from "@/lib/projects";
import Task from "@/models/Task";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";

export const metadata = {
  title: "Project | TeamFlow",
};

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);
  const project = await getProjectInWorkspace(id, workspace._id);

  if (!project) {
    notFound();
  }

  await workspace.populate("members.user", "name");

  const members = workspace.members
    .filter((member) => member.user)
    .map((member) => ({
      id: member.user._id.toString(),
      name: member.user.name,
    }));

  const tasks = await Task.find({ project: project._id })
    .populate("assignee", "name")
    .sort({ createdAt: -1 })
    .lean();

  const plainTasks = tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    assignee: task.assignee
      ? { id: task.assignee._id.toString(), name: task.assignee.name }
      : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Projects
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <NewTaskDialog projectId={id} members={members} />
        </div>
      </div>

      <KanbanBoard tasks={plainTasks} />
    </div>
  );
}
