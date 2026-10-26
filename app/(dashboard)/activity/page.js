import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity as ActivityIcon,
  ArrowRightLeft,
  FolderPlus,
  ListPlus,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getInitials, timeAgo } from "@/lib/format";
import { TASK_STATUSES } from "@/lib/task-options";
import Activity from "@/models/Activity";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Activity | TeamFlow",
};

const ICONS = {
  project_created: { icon: FolderPlus, style: "bg-blue-100 text-blue-600" },
  task_created: { icon: ListPlus, style: "bg-indigo-100 text-indigo-600" },
  task_moved: { icon: ArrowRightLeft, style: "bg-amber-100 text-amber-600" },
  member_added: { icon: UserPlus, style: "bg-emerald-100 text-emerald-600" },
  member_removed: { icon: UserMinus, style: "bg-red-100 text-red-600" },
};

function statusLabel(value) {
  return TASK_STATUSES.find((status) => status.value === value)?.label ?? value;
}

function describe(activity) {
  const details = activity.details ?? {};

  switch (activity.type) {
    case "project_created":
      return (
        <>
          created project <strong>{details.projectName}</strong>
        </>
      );
    case "task_created":
      return (
        <>
          added task <strong>{details.taskTitle}</strong> to{" "}
          {details.projectName}
        </>
      );
    case "task_moved":
      return (
        <>
          moved <strong>{details.taskTitle}</strong> from{" "}
          {statusLabel(details.fromStatus)} to{" "}
          <strong>{statusLabel(details.toStatus)}</strong>
        </>
      );
    case "member_added":
      return (
        <>
          added <strong>{details.memberName}</strong> to the workspace
        </>
      );
    case "member_removed":
      return (
        <>
          removed <strong>{details.memberName}</strong> from the workspace
        </>
      );
    default:
      return "did something";
  }
}

export default async function ActivityPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);

  const activities = await Activity.find({ workspace: workspace._id })
    .populate("actor", "name")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent changes in {workspace.name}
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-background py-16 text-center">
          <ActivityIcon className="size-10 text-muted-foreground" />
          <p className="mt-3 font-medium">No activity yet</p>
          <p className="text-sm text-muted-foreground">
            Create a project or move a task, and it will show up here.
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="divide-y p-0">
            {activities.map((activity) => {
              const { icon: Icon, style } =
                ICONS[activity.type] ?? ICONS.project_created;
              const actorName = activity.actor?.name ?? "Someone";

              const row = (
                <div className="flex items-start gap-4 px-6 py-4">
                  <div className="relative">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(actorName)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full ring-2 ring-background ${style}`}
                    >
                      <Icon className="size-3" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{actorName}</span>{" "}
                      {describe(activity)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {timeAgo(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );

              return activity.project ? (
                <Link
                  key={activity._id.toString()}
                  href={`/projects/${activity.project}`}
                  className="block hover:bg-muted/50"
                >
                  {row}
                </Link>
              ) : (
                <div key={activity._id.toString()}>{row}</div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
