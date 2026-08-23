import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import PasswordInput from "@/react-app/components/PasswordInput";
import { useAuth } from "@/react-app/lib/auth";
import AuthLayout from "@/react-app/components/AuthLayout";

export default function SignIn() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: string } | null)?.from || "/";

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      panelTitle="Welcome back to FXDC Labs"
      panelDescription="Sign in to continue your learning path, track applications, and stay connected with our trading community."
    >
      <div className="mb-8 text-center lg:text-left">
        <h1 className="font-display text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Access your FXDC Labs account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full glow-primary" disabled={submitting || loading}>
          {submitting && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground lg:text-left">
        Don&apos;t have an account?{" "}
        <Link to="/sign-up" className="font-medium text-primary hover:underline">
          Start Learning
        </Link>
      </p>
      <Link
        to="/"
        className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground lg:text-left"
      >
        Back to website
      </Link>
    </AuthLayout>
  );
}
