"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/task-options";
import { getInitials } from "@/lib/format";

function formatDueDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function TaskCard({ task }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const priority = TASK_PRIORITIES.find((item) => item.value === task.priority);

  async function moveTo(status) {
    setUpdating(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        alert("Could not move the task. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div
      className={`rounded-lg border bg-background p-3 shadow-sm transition-opacity ${
        updating ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{task.title}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Task options"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            {TASK_STATUSES.filter((status) => status.value !== task.status).map(
              (status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => moveTo(status.value)}
                >
                  <span className={`size-2 rounded-full ${status.dot}`} />
                  {status.label}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {priority && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.style}`}
            >
              {priority.label}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.assignee && (
          <Avatar className="size-6" title={task.assignee.name}>
            <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
              {getInitials(task.assignee.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
