"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Feather, ArrowRight, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Invalid credentials");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">Writely</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Welcome back, writer.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to continue your writing journey and join the community.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card shadow-xs space-y-4">
          {error && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-identity" className="text-xs font-semibold text-foreground">
                Email or Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-identity"
                  type="text"
                  placeholder="e.g. elena_vance or elena@writely.dev"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !emailOrUsername || !password}
              className="w-full h-10 font-semibold gap-2 shadow-xs"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground text-center">
            Demo account: <strong className="text-foreground">elena_vance</strong> (password: <code className="text-primary font-mono">password123</code>)
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account yet?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
