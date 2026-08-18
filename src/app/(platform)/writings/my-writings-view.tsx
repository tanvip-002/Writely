"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  Trash2,
  Eye,
  Globe,
  Lock,
  FileText,
  Clock,
  Heart,
  BookOpen,
} from "lucide-react";
import { WritingTypeBadge } from "@/components/writing/writing-type-badge";
import { VisibilityBadge } from "@/components/writing/visibility-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { WritingWithAuthor } from "@/types";

interface MyWritingsViewProps {
  initialItems: WritingWithAuthor[];
  authorId: string;
}

type TabType = "ALL" | "PUBLISHED" | "DRAFT" | "PRIVATE" | "ARCHIVED";

export function MyWritingsView({ initialItems, authorId }: MyWritingsViewProps) {
  const [items, setItems] = useState<WritingWithAuthor[]>(initialItems);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PUBLISHED") return item.status === "PUBLISHED" && item.visibility === "PUBLIC";
    if (activeTab === "DRAFT") return item.status === "DRAFT";
    if (activeTab === "PRIVATE") return item.visibility === "PRIVATE";
    if (activeTab === "ARCHIVED") return item.status === "ARCHIVED";
    return true;
  });

  const handleDelete = async (writingId: string) => {
    if (!confirm("Are you sure you want to permanently delete this writing?")) return;

    setDeletingId(writingId);
    try {
      const res = await fetch(`/api/writings/${writingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== writingId));
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "ALL", label: "All Works", count: items.length },
    {
      id: "PUBLISHED",
      label: "Published",
      count: items.filter((i) => i.status === "PUBLISHED" && i.visibility === "PUBLIC").length,
    },
    {
      id: "DRAFT",
      label: "Drafts",
      count: items.filter((i) => i.status === "DRAFT").length,
    },
    {
      id: "PRIVATE",
      label: "Private",
      count: items.filter((i) => i.visibility === "PRIVATE").length,
    },
    {
      id: "ARCHIVED",
      label: "Archived",
      count: items.filter((i) => i.status === "ARCHIVED").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                activeTab === tab.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Writings List */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl border border-border/60 bg-card p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base">No writings found in this category</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You don't have any writings matching "{activeTab.toLowerCase()}". Create a new story or draft to see it here.
          </p>
          <Link href="/create" className="inline-block pt-2">
            <Button size="sm" className="rounded-full text-xs font-semibold">
              Write New Story
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((writing) => (
            <div
              key={writing.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-colors shadow-xs"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <WritingTypeBadge type={writing.writingType} />
                  <VisibilityBadge visibility={writing.visibility} status={writing.status} />
                  {writing.genre && (
                    <span className="text-[11px] text-muted-foreground font-medium">
                      · {writing.genre.name}
                    </span>
                  )}
                </div>

                <Link
                  href={writing.visibility === "PUBLIC" ? `/writing/${writing.slug}` : `/writing/${writing.slug}/edit`}
                  className="block group"
                >
                  <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {writing.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created {formatDate(writing.createdAt)}</span>
                  <span>{writing.wordCount} words</span>
                  {writing._count && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      {writing._count.favourites}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {writing.visibility === "PUBLIC" && writing.status === "PUBLISHED" && (
                  <Link href={`/writing/${writing.slug}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Button>
                  </Link>
                )}

                <Link href={`/writing/${writing.slug}/edit`}>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deletingId === writing.id}
                  onClick={() => handleDelete(writing.id)}
                  className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
