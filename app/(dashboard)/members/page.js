import { redirect } from "next/navigation";
import { Crown } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getInitials } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AddMemberDialog from "@/components/members/AddMemberDialog";
import RemoveMemberButton from "@/components/members/RemoveMemberButton";

export const metadata = {
  title: "Members | TeamFlow",
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function MembersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const workspace = await getCurrentWorkspace(session);
  await workspace.populate("members.user", "name email");

  const isOwner = workspace.owner.toString() === session.userId;

  const members = workspace.members
    .filter((member) => member.user)
    .map((member) => ({
      id: member.user._id.toString(),
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      joinedAt: member.joinedAt,
    }))
    .sort((a, b) => (a.role === "owner" ? -1 : b.role === "owner" ? 1 : 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length} {members.length === 1 ? "person" : "people"} in{" "}
            {workspace.name}
          </p>
        </div>
        {isOwner && <AddMemberDialog />}
      </div>

      <Card>
        <CardContent className="divide-y p-0">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center gap-4 px-6 py-4"
            >
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  <span className="truncate">{member.name}</span>
                  {member.id === session.userId && (
                    <span className="text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden text-xs text-muted-foreground sm:block">
                  Joined {formatDate(member.joinedAt)}
                </span>

                {member.role === "owner" ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    <Crown className="size-3" />
                    Owner
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    Member
                  </span>
                )}

                {isOwner && member.role !== "owner" && (
                  <RemoveMemberButton userId={member.id} name={member.name} />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {!isOwner && (
        <p className="text-sm text-muted-foreground">
          Only the workspace owner can add or remove members.
        </p>
      )}
    </div>
  );
}
