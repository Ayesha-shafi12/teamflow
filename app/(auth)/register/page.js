import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Register | TeamFlow",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Start managing your team&apos;s projects for free
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
