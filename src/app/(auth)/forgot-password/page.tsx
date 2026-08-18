"use client";

import { useState } from "react";
import Link from "next/link";
import { Feather, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">Writely</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Password Recovery
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your account email to receive recovery instructions.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card shadow-xs">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg">Instructions Sent</h3>
              <p className="text-xs text-muted-foreground">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="recovery-email" className="text-xs font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="elena@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-semibold">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
