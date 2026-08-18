"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Feather, ArrowRight, Lock, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to create account");
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
            Join the writers community.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Share your voice, connect with readers, and polish your stories.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card shadow-xs space-y-4">
          {error && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="reg-name" className="text-xs font-semibold text-foreground">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Elena Vance"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-username" className="text-xs font-semibold text-foreground">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">@</span>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="elena_vance"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-email" className="text-xs font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="elena@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-password" className="text-xs font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !username || !displayName || !email || password.length < 8}
              className="w-full h-10 font-semibold gap-2 shadow-xs mt-2"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
