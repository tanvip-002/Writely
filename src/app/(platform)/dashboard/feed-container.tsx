"use client";

import { useState } from "react";
import { Compass, Users, Sparkles, Clock, BookOpen } from "lucide-react";
import { WritingCard } from "@/components/writing/writing-card";
import { Button } from "@/components/ui/button";
import { WritingWithAuthor } from "@/types";

interface FeedContainerProps {
  initialItems: WritingWithAuthor[];
  initialNextCursor?: string;
  currentUserId?: string | null;
}

const TABS = [
  { id: "all", label: "For You", icon: Sparkles },
  { id: "following", label: "Following", icon: Users },
  { id: "popular", label: "Popular", icon: Compass },
  { id: "recent", label: "Recent", icon: Clock },
] as const;

export function FeedContainer({
  initialItems,
  initialNextCursor,
  currentUserId,
}: FeedContainerProps) {
  const [activeTab, setActiveTab] = useState<"all" | "following" | "popular" | "recent">("all");
  const [items, setItems] = useState<WritingWithAuthor[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleTabChange = async (tabId: "all" | "following" | "popular" | "recent") => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setLoading(true);

    try {
      const res = await fetch(`/api/writings?type=${tabId}&limit=10`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.data.items || []);
        setNextCursor(json.data.nextCursor);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(`/api/writings?type=${activeTab}&cursor=${nextCursor}&limit=10`);
      if (res.ok) {
        const json = await res.json();
        setItems((prev) => [...prev, ...(json.data.items || [])]);
        setNextCursor(json.data.nextCursor);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feed Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed Cards Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-xl border border-border/40 bg-card animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center space-y-3 rounded-2xl border border-border/60 bg-card p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base">No writings found in this feed</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === "following"
              ? "Follow other writers across the platform to see their new stories here."
              : "Be the first to publish a new poem, short story, or essay."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((writing) => (
            <WritingCard
              key={writing.id}
              writing={writing}
              currentUserId={currentUserId}
            />
          ))}

          {/* Load More Button */}
          {nextCursor && (
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-full px-6 text-xs font-semibold"
              >
                {loadingMore ? "Loading more..." : "Load Older Writings"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
