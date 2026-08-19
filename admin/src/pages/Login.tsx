import { FormEvent, useState } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/lib/auth";
import { WEBSITE_URL } from "@/lib/config";
import Logo from "@/components/Logo";

export default function Login() {
  const { user, loading, isAdmin, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAdmin) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const account = await login(email.trim(), password);
      if (account.role !== "admin" && account.role !== "superadmin") {
        await logout();
        setError("Admin access only. Use the website sign-in for student accounts.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1C252E]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden bg-[#003768] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,167,111,0.35),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(0,167,111,0.2),transparent_40%)]" />
          <div className="relative flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="text-lg font-bold">FXDC</span>
          </div>
          <div className="relative max-w-lg">
            <p className="text-sm font-medium text-[#5BE49B]">Admin portal</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">Hi, Welcome back</h1>
            <p className="mt-4 text-base text-white/70">
              Manage users, education applications, trading-tools leads, and Cloudinary media from one dashboard.
            </p>
          </div>
          <p className="relative text-sm text-white/50">FXDC Academy · Admin dashboard</p>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-10 lg:hidden">
              <Logo className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold">Sign in to FXDC</h2>
            <p className="mt-2 text-sm text-[#637381]">Enter your admin credentials to continue.</p>

            {user && !isAdmin && (
              <p className="mt-4 rounded-xl bg-[#FFF5CC] px-3 py-2 text-sm text-[#B76E00]">
                You are signed in as a student. Use an admin account for this portal.
              </p>
            )}

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#637381]">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-12 rounded-xl bg-white"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#637381]">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  className="h-12 rounded-xl bg-white"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {error && <p className="text-sm text-[#FF5630]">{error}</p>}
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#00A76F] text-white hover:bg-[#007867]"
                disabled={submitting || loading}
              >
                {submitting && <Loader2 className="animate-spin" />}
                Sign in
              </Button>
            </form>

            <a href={WEBSITE_URL} className="mt-6 inline-block text-sm text-[#637381] hover:text-[#1C252E]">
              Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
