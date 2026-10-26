import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardPreview from "@/components/DashboardPreview";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Plan. Build.
          <br />
          Deliver.
        </h1>

        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          The modern project management tool for your team. Organize your work,
          track progress, and achieve more — together.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>

      <DashboardPreview />
    </section>
  );
}
