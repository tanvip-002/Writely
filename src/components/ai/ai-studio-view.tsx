"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  BookOpen,
  Feather,
  Copy,
  Check,
  RotateCcw,
  Gauge,
  Lightbulb,
  UserCheck,
  GitPullRequest,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIOperationResult } from "@/types";

const AI_TOOLS = [
  { id: "IMPROVE", name: "Improve Writing", desc: "Clarity, flow, and cadence", icon: Wand2 },
  { id: "REWRITE", name: "Rewrite with Tone", desc: "Adapt voice and atmosphere", icon: Feather },
  { id: "CONTINUE", name: "Continue Story", desc: "Seamless narrative extension", icon: BookOpen },
  { id: "SUMMARIZE", name: "Summarize", desc: "Concise elevator pitch & synopsis", icon: Sparkles },
  { id: "TITLE", name: "Generate Titles", desc: "Compelling literary titles", icon: Lightbulb },
  { id: "DESCRIPTION", name: "Blurb & Excerpt", desc: "Back-cover publication blurb", icon: BookOpen },
  { id: "GRAMMAR", name: "Grammar & Style", desc: "Spelling, syntax & polish", icon: CheckCircle2 },
  { id: "TONE", name: "Tone Analysis", desc: "Emotional arc & style metrics", icon: Gauge },
  { id: "SHOW_DONT_TELL", name: "Show Don't Tell", desc: "Turn passive statements into vivid scenes", icon: Sparkles },
  { id: "CHARACTER", name: "Character Arc", desc: "Motives, wounds, and archetypes", icon: UserCheck },
  { id: "PLOT", name: "Plot Twists", desc: "Brainstorm conflicts & twists", icon: GitPullRequest },
];

const TONES = [
  "Professional",
  "Casual",
  "Poetic",
  "Concise",
  "Descriptive",
  "Dramatic",
  "Simple",
];

export function AIStudioView() {
  const [selectedTool, setSelectedTool] = useState("IMPROVE");
  const [selectedTone, setSelectedTone] = useState("Poetic");
  const [inputText, setInputText] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [result, setResult] = useState<AIOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAI = async () => {
    if (!inputText.trim()) {
      setError("Please provide some text to analyze or transform.");
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
          text: inputText.trim(),
          tone: selectedTool === "REWRITE" ? selectedTone : undefined,
          context: contextNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "AI processing failed");
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

  const activeToolObj = AI_TOOLS.find((t) => t.id === selectedTool);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Studio Header */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Writely AI Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Writing Intelligence & Craft Studio
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Crafted to assist, refine, and inspire—never to replace. Select a craft tool below to transform, expand, or analyze your writing.
        </p>
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {AI_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border/60 hover:border-primary/40 hover:bg-muted/30 text-card-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-2 ${
                  isSelected ? "text-primary-foreground" : "text-primary"
                }`}
              />
              <span className="text-xs font-bold leading-tight block">
                {tool.name}
              </span>
              <span
                className={`text-[10px] mt-1 line-clamp-2 leading-tight ${
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {tool.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Studio Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Panel */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base">
                  {activeToolObj?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({activeToolObj?.desc})
                </span>
              </div>

              {selectedTool === "REWRITE" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Tone:</span>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="h-8 w-32 text-xs">
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
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="ai-input" className="text-xs font-semibold text-foreground">
                Your Text or Story Excerpt
              </label>
              <Textarea
                id="ai-input"
                placeholder="Paste or write the text you want the AI assistant to analyze, polish, or expand..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[260px] font-serif text-base leading-relaxed"
              />
              <span className="text-[11px] text-muted-foreground block text-right font-mono">
                {inputText.length} characters
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ai-context" className="text-xs font-semibold text-muted-foreground">
                Optional Guidance / Context
              </label>
              <input
                id="ai-context"
                type="text"
                placeholder="e.g. Set in a dystopian sci-fi world; Protagonist is melancholic"
                value={contextNote}
                onChange={(e) => setContextNote(e.target.value)}
                className="w-full h-8 px-3 text-xs rounded-md border border-input bg-transparent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInputText("");
                setResult(null);
              }}
              className="text-xs text-muted-foreground gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>

            <Button
              onClick={handleRunAI}
              disabled={loading || !inputText.trim()}
              className="gap-2 font-semibold shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? "Generating..." : `Run ${activeToolObj?.name}`}</span>
            </Button>
          </div>
        </div>

        {/* Right: AI Output Panel */}
        <div className="p-6 rounded-2xl border border-border/60 bg-muted/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="font-serif font-bold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Craft Suggestion
              </span>
              {result && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="rounded-full text-xs gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="font-serif text-sm font-semibold">Crafting suggestions...</p>
                <p className="text-xs text-muted-foreground">
                  Analyzing cadence, narrative flow, and literary voice.
                </p>
              </div>
            ) : result ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl bg-card border border-border/60 font-serif text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {result.output}
                </div>

                {result.metadata && (
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-2 border-t border-border/30">
                    <span>Provider: {String(result.metadata.providerName || "Writely AI")}</span>
                    <span>Non-destructive suggestion</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center space-y-2 text-muted-foreground">
                <Sparkles className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p className="font-serif font-semibold text-sm">No suggestions yet</p>
                <p className="text-xs max-w-xs mx-auto">
                  Provide your text on the left and run any craft tool to receive non-destructive enhancements.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
