import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace, getUserWorkspaces } from "@/lib/workspace";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);
  const workspaces = await getUserWorkspaces(session.userId);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={{ name: session.name, email: session.email }}
          workspaces={workspaces}
          currentWorkspaceId={workspace._id.toString()}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
