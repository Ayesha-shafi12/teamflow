"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkspaceSwitcher({ workspaces, currentId }) {
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const current = workspaces.find((workspace) => workspace.id === currentId);

  async function switchTo(workspaceId) {
    if (workspaceId === currentId) return;

    setSwitching(true);

    try {
      const response = await fetch("/api/workspace/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });

      if (!response.ok) {
        alert("Could not switch workspace. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSwitching(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={switching}
          className="flex max-w-56 items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <span className="truncate">{current?.name ?? "Workspace"}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => switchTo(workspace.id)}
          >
            <span className="flex-1 truncate">{workspace.name}</span>
            {workspace.id === currentId && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
