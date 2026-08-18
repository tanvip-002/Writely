import { Badge } from "@/components/ui/badge";
import { WritingType } from "@/types";

const typeLabels: Record<string, string> = {
  POEM: "Poem",
  SHORT_STORY: "Short Story",
  NOVEL: "Novel",
  CHAPTER: "Chapter",
  ESSAY: "Essay",
  ARTICLE: "Article",
  FLASH_FICTION: "Flash Fiction",
  SCREENPLAY: "Screenplay",
  JOURNAL: "Journal",
  OTHER: "Piece",
};

export function WritingTypeBadge({ type }: { type: WritingType | string }) {
  const label = typeLabels[type] || type;
  return (
    <Badge
      variant="outline"
      className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full border-border/70 bg-secondary/50 text-secondary-foreground"
    >
      {label}
    </Badge>
  );
}
