import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FolderKanban,
  ListTodo,
  CircleCheck,
  CircleAlert,
  Calendar,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { projectColorStyles } from "@/lib/project-colors";
import { TASK_PRIORITIES } from "@/lib/task-options";
import { timeAgo } from "@/lib/format";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard | TeamFlow",
};

function formatDueDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const notDone = { $ne: "done" };

  const [
    projectCount,
    recentProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    upcomingTasks,
  ] = await Promise.all([
    Project.countDocuments({ workspace: workspace._id }),
    Project.find({ workspace: workspace._id })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
    Task.countDocuments({ workspace: workspace._id }),
    Task.countDocuments({ workspace: workspace._id, status: "done" }),
    Task.countDocuments({
      workspace: workspace._id,
      status: notDone,
      dueDate: { $ne: null, $lt: startOfToday },
    }),
    Task.find({
      workspace: workspace._id,
      assignee: session.userId,
      status: notDone,
      dueDate: { $ne: null },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate("project", "name")
      .lean(),
  ]);

  const firstName = session.name.split(" ")[0];

  const stats = [
    {
      label: "Total Projects",
      value: projectCount,
      icon: FolderKanban,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CircleCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      icon: CircleAlert,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening in {workspace.name} today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <div
                  className={`flex size-11 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            {recentProjects.length > 0 && (
              <Link
                href="/projects"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                <FolderKanban className="size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No projects yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first project to get started.
                </p>
                <div className="mt-4">
                  <NewProjectDialog />
                </div>
              </div>
            ) : (
              <ul className="divide-y">
                {recentProjects.map((project) => (
                  <li key={project._id.toString()}>
                    <Link
                      href={`/projects/${project._id}`}
                      className="flex items-center gap-3 rounded-lg py-3 hover:bg-muted/50"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${projectColorStyles[project.color] ?? projectColorStyles.blue}`}
                      >
                        <FolderKanban className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {timeAgo(project.updatedAt)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                <ListTodo className="size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No upcoming tasks</p>
                <p className="text-sm text-muted-foreground">
                  Tasks assigned to you with a due date will appear here.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingTasks.map((task) => {
                  const isOverdue = new Date(task.dueDate) < startOfToday;
                  const priority = TASK_PRIORITIES.find(
                    (item) => item.value === task.priority,
                  );

                  return (
                    <li key={task._id.toString()}>
                      <Link
                        href={`/projects/${task.project?._id}`}
                        className="block rounded-lg border p-3 hover:bg-muted/50"
                      >
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                          <span className="truncate text-muted-foreground">
                            {task.project?.name}
                          </span>
                          <span
                            className={`flex shrink-0 items-center gap-1 ${
                              isOverdue
                                ? "font-medium text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Calendar className="size-3" />
                            {formatDueDate(task.dueDate)}
                          </span>
                        </div>
                        {priority && (
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priority.style}`}
                          >
                            {priority.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
