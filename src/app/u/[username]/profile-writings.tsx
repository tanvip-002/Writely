"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { WritingCard } from "@/components/writing/writing-card";
import { WritingWithAuthor } from "@/types";

const TABS = [
  { id: "ALL", label: "All Works" },
  { id: "POEM", label: "Poems" },
  { id: "SHORT_STORY", label: "Short Stories" },
  { id: "NOVEL", label: "Novels" },
  { id: "CHAPTER", label: "Chapters" },
  { id: "ESSAY", label: "Essays" },
];

interface ProfileWritingsProps {
  initialWritings: WritingWithAuthor[];
  authorName: string;
  currentUserId?: string | null;
}

export function ProfileWritings({
  initialWritings,
  authorName,
  currentUserId,
}: ProfileWritingsProps) {
  const [activeType, setActiveType] = useState("ALL");

  const filtered = initialWritings.filter((w) => {
    if (activeType === "ALL") return true;
    return w.writingType === activeType;
  });

  return (
    <div className="space-y-6">
      {/* Type Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/50 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveType(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeType === t.id
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-2 rounded-2xl border border-border/60 bg-card p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base">No writings found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {authorName} has not published any pieces in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => (
            <WritingCard key={w.id} writing={w} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
