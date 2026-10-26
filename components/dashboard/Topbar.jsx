import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import UserMenu from "@/components/dashboard/UserMenu";
import WorkspaceSwitcher from "@/components/dashboard/WorkspaceSwitcher";

export default function Topbar({ user, workspaces, currentWorkspaceId }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="lg:hidden">
        <Logo />
      </div>

      <WorkspaceSwitcher
        workspaces={workspaces}
        currentId={currentWorkspaceId}
      />

      <div className="relative hidden w-full max-w-sm md:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-5" />
        </button>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
