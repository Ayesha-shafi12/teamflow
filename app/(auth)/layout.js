import Logo from "@/components/Logo";
import DashboardPreview from "@/components/DashboardPreview";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-muted/40 p-10 lg:flex">
        <Logo />

        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Plan. Build. Deliver.
          </h2>
          <p className="mt-2 text-muted-foreground">
            Organize your work and collaborate with your team in one place.
          </p>
          <div className="mt-10 max-w-md">
            <DashboardPreview />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">© 2026 TeamFlow</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
