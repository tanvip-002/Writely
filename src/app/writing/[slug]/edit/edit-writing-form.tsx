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
  Trash2,
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

interface EditWritingFormProps {
  writing: {
    id: string;
    title: string;
    slug: string;
    content: string;
    writingType: WritingType;
    genreId: string;
    visibility: Visibility;
    status: WritingStatus;
    tags: string[];
  };
  genres: { id: string; name: string; slug: string }[];
}

export function EditWritingForm({ writing, genres }: EditWritingFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(writing.title);
  const [content, setContent] = useState(writing.content);
  const [writingType, setWritingType] = useState<WritingType>(writing.writingType);
  const [genreId, setGenreId] = useState<string>(writing.genreId || "NONE");
  const [visibility, setVisibility] = useState<Visibility>(writing.visibility);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(writing.tags);
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
    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/writings/${writing.id}`, {
        method: "PATCH",
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
        throw new Error(json.error?.message || "Failed to update writing");
      }

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this writing?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/writings/${writing.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/writings");
        router.refresh();
      }
    } catch {
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

      {/* Configuration Header */}
      <div className="p-5 rounded-2xl border border-border/60 bg-card space-y-4 shadow-xs">
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
                placeholder="Add tag..."
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
        onOpenAI={(text) => {
          setAiSelectedText(text);
          setIsAIModalOpen(true);
        }}
      />

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={handleDelete}
          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Piece</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => handleSave("DRAFT")}
            className="rounded-full px-5 text-xs font-semibold gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save as Draft</span>
          </Button>

          <Button
            type="button"
            disabled={loading || !title.trim()}
            onClick={() => handleSave("PUBLISHED")}
            className="rounded-full px-6 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{loading ? "Updating..." : "Update & Publish"}</span>
          </Button>
        </div>
      </div>

      {/* AI Modal */}
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
