import Link from "next/link";
import { Users } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Users className="size-4" />
      </div>
      <span className="text-lg font-semibold tracking-tight">TeamFlow</span>
    </Link>
  );
}
