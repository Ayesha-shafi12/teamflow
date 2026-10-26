"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RemoveMemberButton({ userId, name }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    const confirmed = window.confirm(
      `Remove ${name} from this workspace? Their tasks will become unassigned.`,
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/workspace/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.error);
        return;
      }

      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRemove}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      {loading ? "Removing..." : "Remove"}
    </Button>
  );
}
