export const TASK_STATUSES = [
  { value: "todo", label: "To Do", dot: "bg-slate-400" },
  { value: "in_progress", label: "In Progress", dot: "bg-blue-500" },
  { value: "done", label: "Done", dot: "bg-emerald-500" },
];

export const TASK_PRIORITIES = [
  { value: "low", label: "Low", style: "bg-emerald-100 text-emerald-700" },
  { value: "medium", label: "Medium", style: "bg-amber-100 text-amber-700" },
  { value: "high", label: "High", style: "bg-red-100 text-red-700" },
];

export const STATUS_VALUES = TASK_STATUSES.map((status) => status.value);
export const PRIORITY_VALUES = TASK_PRIORITIES.map(
  (priority) => priority.value,
);
