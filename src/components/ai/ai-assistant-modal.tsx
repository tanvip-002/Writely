"use client";

import { useState } from "react";
import { Sparkles, Wand2, Copy, Check, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIOperationResult } from "@/types";

const QUICK_TOOLS = [
  { id: "IMPROVE", name: "Improve Clarity & Flow" },
  { id: "REWRITE", name: "Rewrite with Style" },
  { id: "CONTINUE", name: "Continue Story" },
  { id: "SHOW_DONT_TELL", name: "Show Don't Tell" },
  { id: "GRAMMAR", name: "Grammar & Polish" },
  { id: "TITLE", name: "Generate Titles" },
];

const TONES = [
  "Poetic",
  "Dramatic",
  "Concise",
  "Descriptive",
  "Professional",
  "Casual",
  "Simple",
];

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onApplyText?: (newText: string) => void;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  initialText,
  onApplyText,
}: AIAssistantModalProps) {
  const [selectedTool, setSelectedTool] = useState("IMPROVE");
  const [selectedTone, setSelectedTone] = useState("Poetic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIOperationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!initialText.trim()) {
      setError("Please select or write some text in the editor first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedTool,
          text: initialText.trim(),
          tone: selectedTool === "REWRITE" ? selectedTone : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "AI failed to process");
      }

      setResult(json.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyText?.(result.output);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI Writing Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-48 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUICK_TOOLS.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTool === "REWRITE" && (
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={handleRun}
              disabled={loading || !initialText.trim()}
              size="sm"
              className="gap-1.5 font-semibold ml-auto"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{loading ? "Generating..." : "Generate"}</span>
            </Button>
          </div>

          {error && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {/* Original Text Preview */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs text-muted-foreground max-h-24 overflow-y-auto font-serif">
            <strong className="block text-foreground mb-1 font-sans">Selected Source Text:</strong>
            {initialText || "No text selected in editor."}
          </div>

          {/* Result Preview */}
          {result && (
            <div className="space-y-3 pt-2 border-t border-border/40 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">AI Suggestion</span>
                <span className="text-[11px] text-muted-foreground">Non-destructive</span>
              </div>

              <div className="p-4 rounded-xl bg-card border border-primary/30 font-serif text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {result.output}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs gap-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>

                {onApplyText && (
                  <Button size="sm" onClick={handleApply} className="text-xs gap-1 font-semibold">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Replace Selection</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
