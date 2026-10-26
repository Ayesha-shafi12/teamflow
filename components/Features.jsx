import { FolderKanban, TrendingUp, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Manage Projects",
    description: "Keep everything organized",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Stay on schedule",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work better together",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your data is safe",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
