"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/task-options";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export default function NewTaskDialog({ projectId, members }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleOpenChange(value) {
    setOpen(value);
    if (!value) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>
          <DialogDescription>
            Create a new task in this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Fix authentication bug"
              maxLength={200}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add more details..."
              maxLength={2000}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                defaultValue="medium"
                className={selectClass}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue="todo"
                className={selectClass}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <select
                id="assignee"
                name="assignee"
                defaultValue=""
                className={selectClass}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
