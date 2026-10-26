import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login | TeamFlow",
};

export default async function LoginPage({ searchParams }) {
  const { registered } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Log in to your account to continue
      </p>

      {registered && (
        <div className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Account created! Please log in.
        </div>
      )}

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
