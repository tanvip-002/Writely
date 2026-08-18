import { Lock, Globe, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Visibility, WritingStatus } from "@/types";

export function VisibilityBadge({
  visibility,
  status,
}: {
  visibility: Visibility | string;
  status?: WritingStatus | string;
}) {
  if (status === "DRAFT") {
    return (
      <Badge variant="outline" className="gap-1 text-[11px] bg-amber-500/10 text-amber-600 border-amber-500/20">
        <FileText className="w-3 h-3" />
        Draft
      </Badge>
    );
  }

  if (visibility === "PRIVATE") {
    return (
      <Badge variant="outline" className="gap-1 text-[11px] bg-purple-500/10 text-purple-600 border-purple-500/20">
        <Lock className="w-3 h-3" />
        Private
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 text-[11px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
      <Globe className="w-3 h-3" />
      Public
    </Badge>
  );
}
