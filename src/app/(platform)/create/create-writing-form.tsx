"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Lock,
  Sparkles,
  Save,
  CheckCircle2,
  FileText,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/writing/rich-text-editor";
import { AIAssistantModal } from "@/components/ai/ai-assistant-modal";
import { WritingType, Visibility, WritingStatus } from "@/types";

const WRITING_TYPES: { id: WritingType; label: string }[] = [
  { id: "SHORT_STORY", label: "Short Story" },
  { id: "POEM", label: "Poem" },
  { id: "NOVEL", label: "Novel" },
  { id: "CHAPTER", label: "Chapter" },
  { id: "ESSAY", label: "Essay" },
  { id: "ARTICLE", label: "Article" },
  { id: "FLASH_FICTION", label: "Flash Fiction" },
  { id: "SCREENPLAY", label: "Screenplay" },
  { id: "JOURNAL", label: "Journal" },
  { id: "OTHER", label: "Other" },
];

interface CreateWritingFormProps {
  genres: { id: string; name: string; slug: string }[];
}

export function CreateWritingForm({ genres }: CreateWritingFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writingType, setWritingType] = useState<WritingType>("SHORT_STORY");
  const [genreId, setGenreId] = useState<string>("NONE");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiSelectedText, setAiSelectedText] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase().replace(/[^\w-]/g, "");
      if (val && !tags.includes(val) && tags.length < 8) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (status: WritingStatus) => {
    if (!title.trim()) {
      setError("Please enter a title for your writing.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Please write some content before publishing or saving.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/writings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          writingType,
          genreId: genreId === "NONE" ? null : genreId,
          visibility,
          status,
          tags,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to save writing");
      }

      const writing = json.data.writing;
      if (status === "PUBLISHED" && visibility === "PUBLIC") {
        router.push(`/writing/${writing.slug}`);
      } else {
        router.push("/writings");
      }
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 text-xs sm:text-sm bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium animate-in fade-in">
          {error}
        </div>
      )}

      {/* Metadata Configuration Bar */}
      <div className="p-5 rounded-2xl border border-border/60 bg-card space-y-4 shadow-xs">
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Title of your piece..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-serif text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/60 text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/40">
          {/* Writing Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Type</label>
            <Select value={writingType} onValueChange={(v) => setWritingType(v as WritingType)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WRITING_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Genre</label>
            <Select value={genreId} onValueChange={setGenreId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE" className="text-xs">Uncategorized</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g.id} value={g.id} className="text-xs">
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Visibility</label>
            <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setVisibility("PUBLIC")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs rounded-md transition-colors ${
                  visibility === "PUBLIC"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility("PRIVATE")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs rounded-md transition-colors ${
                  visibility === "PRIVATE"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-purple-500" />
                <span>Private</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2">
            <TagIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <label className="text-xs font-semibold text-muted-foreground">
              Tags (Press Enter or comma to add)
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {tags.length < 8 && (
              <input
                type="text"
                placeholder={tags.length === 0 ? "e.g. poetry, romance, memoir" : "Add tag..."}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="h-7 px-2 text-xs bg-transparent border-none outline-none placeholder:text-muted-foreground min-w-[120px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* TipTap Rich Text Editor */}
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Begin writing your piece here. Select text to trigger AI writing assistance, formatting, or quotes..."
        onOpenAI={(text) => {
          setAiSelectedText(text);
          setIsAIModalOpen(true);
        }}
      />

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="text-xs text-muted-foreground">
          {visibility === "PRIVATE" ? (
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Lock className="w-3.5 h-3.5" />
              Private piece — visible only to you.
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              Public piece — will appear in feeds & profile.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => handleSave("DRAFT")}
            className="rounded-full px-5 text-xs font-semibold gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            disabled={loading || !title.trim()}
            onClick={() => handleSave("PUBLISHED")}
            className="rounded-full px-6 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{loading ? "Publishing..." : "Publish"}</span>
          </Button>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialText={aiSelectedText}
        onApplyText={(replacement) => {
          setContent((prev) => prev.replace(aiSelectedText, replacement));
        }}
      />
    </div>
  );
}
