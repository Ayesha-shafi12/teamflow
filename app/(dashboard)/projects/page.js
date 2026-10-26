import { redirect } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import Project from "@/models/Project";
import Task from "@/models/Task";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import ProjectCard from "@/components/projects/ProjectCard";

export const metadata = {
  title: "Projects | TeamFlow",
};

export default async function ProjectsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);

  const [projects, taskCounts] = await Promise.all([
    Project.find({ workspace: workspace._id }).sort({ updatedAt: -1 }).lean(),
    Task.aggregate([
      { $match: { workspace: workspace._id } },
      {
        $group: {
          _id: "$project",
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
        },
      },
    ]),
  ]);

  const progressByProject = Object.fromEntries(
    taskCounts.map((count) => [
      count._id.toString(),
      { done: count.done, total: count.total },
    ]),
  );

  const memberCount = workspace.members.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your projects and track progress
          </p>
        </div>
        <NewProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-background py-16 text-center">
          <FolderKanban className="size-10 text-muted-foreground" />
          <p className="mt-3 font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground">
            Click &quot;New Project&quot; to create your first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id.toString()}
              project={project}
              memberCount={memberCount}
              progress={progressByProject[project._id.toString()]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
