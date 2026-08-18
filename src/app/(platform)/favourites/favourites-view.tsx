"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Compass } from "lucide-react";
import { WritingCard } from "@/components/writing/writing-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WritingWithAuthor } from "@/types";

const WRITING_TYPES = [
  { id: "ALL", label: "All Types" },
  { id: "POEM", label: "Poems" },
  { id: "SHORT_STORY", label: "Short Stories" },
  { id: "NOVEL", label: "Novels" },
  { id: "CHAPTER", label: "Chapters" },
  { id: "ESSAY", label: "Essays" },
];

interface FavouritesViewProps {
  initialItems: WritingWithAuthor[];
  genres: { id: string; name: string; slug: string }[];
  currentUserId: string;
}

export function FavouritesView({
  initialItems,
  genres,
  currentUserId,
}: FavouritesViewProps) {
  const [items, setItems] = useState<WritingWithAuthor[]>(initialItems);
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedGenre, setSelectedGenre] = useState("ALL");

  const filteredItems = items.filter((item) => {
    if (selectedType !== "ALL" && item.writingType !== selectedType) return false;
    if (selectedGenre !== "ALL" && item.genre?.slug !== selectedGenre) return false;
    return true;
  });

  const handleFavouriteChange = (writingId: string, isFav: boolean) => {
    if (!isFav) {
      setItems((prev) => prev.filter((i) => i.id !== writingId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4 rounded-xl border border-border/60 bg-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {WRITING_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedType === t.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">All Genres</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g.id} value={g.slug} className="text-xs">
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl border border-border/60 bg-card p-8">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg">No favourited writings yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Explore public works across the community and click the heart icon on any story to save it to your personal shelf.
          </p>
          <Link href="/explore" className="inline-block pt-2">
            <Button size="sm" className="rounded-full text-xs font-semibold">
              Explore Writings
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((writing) => (
            <WritingCard
              key={writing.id}
              writing={{ ...writing, isFavourited: true }}
              currentUserId={currentUserId}
              onFavouriteChange={handleFavouriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
