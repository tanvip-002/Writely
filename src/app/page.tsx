import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  Feather,
  BookOpen,
  Sparkles,
  Shield,
  MessageSquare,
  ArrowRight,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      {/* Header Navigation */}
      <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md px-6 sm:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Writely
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
              Writers Social Network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Explore Works</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm font-semibold rounded-full px-5">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="text-xs sm:text-sm font-semibold rounded-full px-5 shadow-xs">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Sanctuary for Words & Craft</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.15]">
          A social network built specifically for{" "}
          <span className="italic font-serif text-primary">writers</span>.
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Publish poems, short stories, essays, and novels. Connect through respectful request-based messaging, and elevate your craft with an AI studio designed for authors.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-md gap-2">
              <span>Start Writing Today</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
              <span>Explore Library</span>
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left w-full">
          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg">Distraction-Free Publishing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rich typography, customized formats from poetry to novels, and strict server-side private/public visibility control.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg">AI Craft Studio</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Eleven specialized tools for tone transformation, cadence improvement, character development, and show-don't-tell rewrites.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg">Request-Based Messaging</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Meaningful connections without unwanted spam. Exchange ideas, feedback, and collaborations on your terms.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6 sm:px-12 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Feather className="w-4 h-4 text-primary" />
          <span className="font-serif font-bold text-foreground">Writely</span>
          <span>© 2026. Designed for writers worldwide.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-foreground transition-colors">
            Create Account
          </Link>
        </div>
      </footer>
    </div>
  );
}
