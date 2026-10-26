import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function PATCH(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return Response.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    if (trimmedName.length > 60) {
      return Response.json(
        { error: "Workspace name must be 60 characters or less" },
        { status: 400 },
      );
    }

    const workspace = await getCurrentWorkspace(session);

    if (workspace.owner.toString() !== session.userId) {
      return Response.json(
        { error: "Only the workspace owner can rename it" },
        { status: 403 },
      );
    }

    workspace.name = trimmedName;
    await workspace.save();

    return Response.json({ message: "Workspace renamed" });
  } catch (error) {
    console.error("Rename workspace error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
