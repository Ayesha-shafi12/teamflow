import Link from "next/link";
import { FolderKanban, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { projectColorStyles } from "@/lib/project-colors";
import { timeAgo } from "@/lib/format";

export default function ProjectCard({
  project,
  memberCount,
  progress = { done: 0, total: 0 },
}) {
  const colorClass =
    projectColorStyles[project.color] ?? projectColorStyles.blue;
  const percent =
    progress.total === 0
      ? 0
      : Math.round((progress.done / progress.total) * 100);

  return (
    <Link
      href={`/projects/${project._id}`}
      className="block rounded-xl transition-shadow hover:shadow-md"
    >
      <Card>
        <CardContent className="flex items-start gap-4">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
          >
            <FolderKanban className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{project.name}</h3>

            {project.description && (
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}

            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>
                  {progress.done} of {progress.total} tasks done
                </span>
                <span className="font-medium text-foreground">{percent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                Updated {timeAgo(project.updatedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
