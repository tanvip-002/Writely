"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  Clock,
  BookOpen,
  Type,
  Check,
  ArrowLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import { WritingTypeBadge } from "./writing-type-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { WritingWithAuthor } from "@/types";

interface ReaderViewProps {
  writing: WritingWithAuthor & {
    moreFromAuthor?: unknown[];
  };
  currentUserId?: string | null;
}

export function ReaderView({ writing, currentUserId }: ReaderViewProps) {
  const [isFavourited, setIsFavourited] = useState(writing.isFavourited || false);
  const [favCount, setFavCount] = useState(writing._count?.favourites || 0);
  const [copied, setCopied] = useState(false);
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleFavourite = async () => {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }

    const nextState = !isFavourited;
    setIsFavourited(nextState);
    setFavCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch("/api/social/favourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writingId: writing.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavourited(data.data.favourited);
      }
    } catch {
      setIsFavourited(!nextState);
      setFavCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: writing.title,
          text: `Read "${writing.title}" by ${writing.author.displayName} on Writely`,
          url: shareUrl,
        });
        return;
      } catch {
        // clipboard fallback
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontClass = fontFamily === "serif" ? "font-serif" : "font-sans";

  const sizeClasses = {
    sm: "text-base leading-relaxed",
    base: "text-lg leading-loose",
    lg: "text-xl leading-loose",
    xl: "text-2xl leading-loose",
  };

  return (
    <div className="min-h-screen">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Reader Navigation & Controls Bar */}
      <div className="sticky top-16 z-20 bg-background/90 backdrop-blur-md border-b border-border/40 py-3 mb-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Feed</span>
          </Link>

          {/* Reader Preferences Bar */}
          <div className="flex items-center gap-2">
            {/* Serif / Sans Toggle */}
            <div className="flex items-center bg-muted/60 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFontFamily("serif")}
                className={`px-2.5 py-1 rounded font-serif text-sm transition-colors ${
                  fontFamily === "serif"
                    ? "bg-background text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily("sans")}
                className={`px-2.5 py-1 rounded font-sans text-xs transition-colors ${
                  fontFamily === "sans"
                    ? "bg-background text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sans
              </button>
            </div>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-muted/60 rounded-lg p-0.5 text-xs">
              {(["sm", "base", "lg", "xl"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-2 py-1 rounded transition-colors uppercase ${
                    fontSize === s
                      ? "bg-background text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavourite}
              className={`rounded-full gap-1.5 text-xs ${
                isFavourited
                  ? "text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-950/20 font-semibold"
                  : ""
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavourited ? "fill-current" : ""}`} />
              <span>{favCount}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reader Document Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        {/* Document Header */}
        <header className="space-y-6 pb-8 border-b border-border/50 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <WritingTypeBadge type={writing.writingType} />
            {writing.genre && (
              <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {writing.genre.name}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
            {writing.title}
          </h1>

          {/* Author Metadata */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
            <Link
              href={`/u/${writing.author.username}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="w-11 h-11 border border-border/60">
                <AvatarImage src={writing.author.avatarUrl || undefined} alt={writing.author.displayName} />
                <AvatarFallback>{writing.author.displayName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors block">
                  {writing.author.displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{writing.author.username}
                </span>
              </div>
            </Link>

            <div className="hidden sm:block h-4 w-[1px] bg-border" />

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(writing.publishedAt || writing.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {writing.readingTime} min read ({writing.wordCount} words)
              </span>
            </div>
          </div>
        </header>

        {/* Story Prose Body */}
        <div
          className={`mt-10 ${fontClass} ${sizeClasses[fontSize]} text-foreground/90 prose-headings:font-serif prose-headings:font-bold prose-p:my-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:pl-4 prose-hr:my-10`}
          dangerouslySetInnerHTML={{ __html: writing.content }}
        />

        {/* Tags */}
        {writing.tags && writing.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border/40 flex flex-wrap gap-2">
            {writing.tags.map((t) => (
              <Link
                key={t.tag.id}
                href={`/explore?tag=${encodeURIComponent(t.tag.name)}`}
                className="px-3 py-1 rounded-full bg-muted/70 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                #{t.tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* About the Author Section */}
        <section className="mt-14 p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <Avatar className="w-16 h-16 border-2 border-border/60">
              <AvatarImage src={writing.author.avatarUrl || undefined} alt={writing.author.displayName} />
              <AvatarFallback>{writing.author.displayName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {writing.author.displayName}
                  </h2>
                  <p className="text-xs text-muted-foreground">@{writing.author.username}</p>
                </div>
                <Link href={`/u/${writing.author.username}`}>
                  <Button size="sm" variant="outline" className="rounded-full text-xs">
                    View Profile
                  </Button>
                </Link>
              </div>
              {writing.author.bio && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {writing.author.bio}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
