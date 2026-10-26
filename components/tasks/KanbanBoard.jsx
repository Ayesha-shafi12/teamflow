import TaskCard from "@/components/tasks/TaskCard";
import { TASK_STATUSES } from "@/lib/task-options";

export default function KanbanBoard({ tasks }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.value,
        );

        return (
          <div key={column.value} className="rounded-xl bg-muted/50 p-3">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={`size-2 rounded-full ${column.dot}`} />
              <h2 className="text-sm font-semibold">{column.label}</h2>
              <span className="text-xs text-muted-foreground">
                ({columnTasks.length})
              </span>
            </div>

            <div className="space-y-2">
              {columnTasks.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                  No tasks
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
