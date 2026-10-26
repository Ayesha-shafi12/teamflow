"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsForm({
  action,
  submitLabel,
  successMessage,
  resetOnSuccess = false,
  children,
}) {
  const router = useRouter();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus({ type: "", message: "" });
    setLoading(true);

    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(action, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: result.error });
        return;
      }

      setStatus({ type: "success", message: successMessage });

      if (resetOnSuccess) {
        form.reset();
      }

      router.refresh();
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.message && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            status.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {status.message}
        </div>
      )}

      {children}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
