const columns = [
  {
    title: "To Do",
    dot: "bg-slate-400",
    tasks: ["Design homepage", "Write content"],
  },
  {
    title: "In Progress",
    dot: "bg-blue-500",
    tasks: ["Build API", "Create dashboard"],
  },
  {
    title: "Done",
    dot: "bg-emerald-500",
    tasks: ["Design database", "Create login page"],
  },
];

export default function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />

      <div className="rounded-2xl border bg-card p-4 shadow-xl">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-yellow-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">
            Website Redesign
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {columns.map((column) => (
            <div key={column.title} className="rounded-xl bg-muted/60 p-2">
              <div className="mb-2 flex items-center gap-1.5 px-1">
                <span className={`size-2 rounded-full ${column.dot}`} />
                <span className="text-xs font-medium">{column.title}</span>
              </div>

              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div
                    key={task}
                    className="rounded-lg border bg-background p-2 text-xs shadow-sm"
                  >
                    {task}
                    <div className="mt-2 h-1.5 w-2/3 rounded-full bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
