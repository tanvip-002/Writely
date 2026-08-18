"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Compass, User, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WritingCard } from "@/components/writing/writing-card";
import { WritingTypeBadge } from "@/components/writing/writing-type-badge";
import { WritingWithAuthor } from "@/types";

const WRITING_TYPES = [
  { id: "ALL", label: "All Types" },
  { id: "POEM", label: "Poems" },
  { id: "SHORT_STORY", label: "Short Stories" },
  { id: "NOVEL", label: "Novels" },
  { id: "CHAPTER", label: "Chapters" },
  { id: "ESSAY", label: "Essays" },
  { id: "ARTICLE", label: "Articles" },
  { id: "FLASH_FICTION", label: "Flash Fiction" },
];

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "newest", label: "Newest First" },
  { id: "popular", label: "Most Favourited" },
  { id: "words", label: "Longest Works" },
];

interface SearchViewProps {
  initialQuery?: string;
  initialTag?: string;
  initialGenre?: string;
  genres: { id: string; name: string; slug: string }[];
  currentUserId?: string | null;
}

export function SearchView({
  initialQuery = "",
  initialTag = "",
  initialGenre = "",
  genres,
  currentUserId,
}: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre || "ALL");
  const [selectedSort, setSelectedSort] = useState<string>("relevance");
  const [activeTab, setActiveTab] = useState<"writings" | "writers">("writings");

  const [writings, setWritings] = useState<WritingWithAuthor[]>([]);
  const [writers, setWriters] = useState<any[]>([]);
  const [totalWritings, setTotalWritings] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (selectedType !== "ALL") params.set("writingType", selectedType);
      if (selectedGenre !== "ALL") params.set("genre", selectedGenre);
      if (initialTag) params.set("tag", initialTag);
      params.set("sortBy", selectedSort);

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setWritings(json.data.writings || []);
        setWriters(json.data.users || []);
        setTotalWritings(json.data.writingsTotal || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, selectedType, selectedGenre, selectedSort, initialTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          {initialTag ? `Tagged: #${initialTag}` : "Discover & Search"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore stories, poems, essays, and authors from the global writers community.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, themes, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl text-sm"
            />
          </div>
          <Button type="submit" className="h-11 px-6 rounded-xl font-semibold">
            Search
          </Button>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-border/60 bg-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Writing Type Pills */}
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

          {/* Genre & Sort Selects */}
          <div className="flex flex-wrap items-center gap-2">
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

            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Writers Matches Carousel/Row if query given */}
      {writers.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Matching Writers ({writers.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {writers.map((w) => (
              <Link
                key={w.id}
                href={`/u/${w.username}`}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30 transition-all group"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={w.avatarUrl || undefined} alt={w.displayName} />
                  <AvatarFallback>{w.displayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                    {w.displayName}
                  </span>
                  <span className="text-xs text-muted-foreground block truncate">
                    @{w.username} · {w._count?.followers || 0} followers
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Writings Results Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Writings ({totalWritings})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-xl border border-border/40 bg-card p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : writings.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg">No writings found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search terms or clearing some filters to explore more written works.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writings.map((writing) => (
              <WritingCard
                key={writing.id}
                writing={writing}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
