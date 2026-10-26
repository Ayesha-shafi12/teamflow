import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import User from "@/models/User";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordInput from "@/components/PasswordInput";
import SettingsForm from "@/components/settings/SettingsForm";

export const metadata = {
  title: "Settings | TeamFlow",
};

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);
  const user = await User.findById(session.userId).select("name email").lean();
  const isOwner = workspace.owner.toString() === session.userId;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and workspace
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This name is shown to your teammates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            action="/api/account/profile"
            submitLabel="Save name"
            successMessage="Your name has been updated."
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user?.name}
                maxLength={60}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" value={user?.email ?? ""} disabled readOnly />
              <p className="text-xs text-muted-foreground">
                Email can&apos;t be changed.
              </p>
            </div>
          </SettingsForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Use at least 8 characters. You&apos;ll stay logged in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            action="/api/account/password"
            submitLabel="Change password"
            successMessage="Your password has been changed."
            resetOnSuccess
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <PasswordInput
                id="currentPassword"
                name="currentPassword"
                placeholder="Enter your current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                placeholder="At least 8 characters"
              />
            </div>
          </SettingsForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            {isOwner
              ? "Rename your workspace. Everyone in it will see the new name."
              : "Only the workspace owner can rename it."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOwner ? (
            <SettingsForm
              action="/api/workspace"
              submitLabel="Save workspace name"
              successMessage="Workspace renamed."
            >
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace name</Label>
                <Input
                  id="workspaceName"
                  name="name"
                  defaultValue={workspace.name}
                  maxLength={60}
                  required
                />
              </div>
            </SettingsForm>
          ) : (
            <Input value={workspace.name} disabled readOnly />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
