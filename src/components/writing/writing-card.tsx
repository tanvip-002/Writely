"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Share2, Clock, BookOpen, Check } from "lucide-react";
import { WritingTypeBadge } from "./writing-type-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { WritingWithAuthor } from "@/types";

interface WritingCardProps {
  writing: WritingWithAuthor;
  currentUserId?: string | null;
  onFavouriteChange?: (writingId: string, isFav: boolean) => void;
}

export function WritingCard({
  writing,
  currentUserId,
  onFavouriteChange,
}: WritingCardProps) {
  const [isFavourited, setIsFavourited] = useState(writing.isFavourited || false);
  const [favouriteCount, setFavouriteCount] = useState(writing._count?.favourites || 0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }

    // Optimistic update
    const nextState = !isFavourited;
    setIsFavourited(nextState);
    setFavouriteCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      setLoading(true);
      const res = await fetch("/api/social/favourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writingId: writing.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavourited(data.data.favourited);
        onFavouriteChange?.(writing.id, data.data.favourited);
      }
    } catch {
      // Revert on error
      setIsFavourited(!nextState);
      setFavouriteCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/writing/${writing.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: writing.title,
          text: `Read "${writing.title}" by ${writing.author.displayName} on Writely`,
          url: shareUrl,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }

    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <div className="space-y-4">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/u/${writing.author.username}`}
            className="flex items-center gap-3 group/author"
          >
            <Avatar className="w-9 h-9 border border-border/50">
              <AvatarImage src={writing.author.avatarUrl || undefined} alt={writing.author.displayName} />
              <AvatarFallback>{writing.author.displayName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-foreground group-hover/author:text-primary transition-colors block truncate">
                {writing.author.displayName}
              </span>
              <span className="text-xs text-muted-foreground block truncate">
                @{writing.author.username} · {formatDate(writing.publishedAt || writing.createdAt)}
              </span>
            </div>
          </Link>

          <WritingTypeBadge type={writing.writingType} />
        </div>

        {/* Writing Content Link */}
        <Link href={`/writing/${writing.slug}`} className="block group-hover:opacity-95 transition-opacity">
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {writing.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {writing.excerpt || writing.content.replace(/<[^>]*>?/gm, "").slice(0, 180)}
          </p>
        </Link>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {writing.readingTime} min read
          </span>
          {writing.genre && (
            <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground/80">
              {writing.genre.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Favourite Button */}
          <button
            onClick={handleToggleFavourite}
            disabled={loading}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              isFavourited
                ? "text-rose-500 bg-rose-500/10 font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
            aria-label="Favourite"
          >
            <Heart className={`w-4 h-4 ${isFavourited ? "fill-current" : ""}`} />
            <span>{favouriteCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Share writing"
            aria-label="Share"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Read Button */}
          <Link
            href={`/writing/${writing.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors ml-1"
          >
            <span>Read</span>
            <BookOpen className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
