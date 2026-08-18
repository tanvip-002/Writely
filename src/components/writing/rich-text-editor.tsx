"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Minus,
  Undo,
  Redo,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onOpenAI?: (selectedText: string) => void;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Once upon a time...",
  onOpenAI,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[420px] p-6 text-base sm:text-lg leading-relaxed font-serif",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[450px] rounded-xl border border-border/60 bg-card p-6 animate-pulse">
        <div className="h-8 bg-muted rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  const handleAIClick = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    const textToProcess = selectedText || editor.getText();
    onOpenAI?.(textToProcess);
  };

  const words = editor.storage.characterCount.words();
  const characters = editor.storage.characterCount.characters();

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden flex flex-col focus-within:border-primary/50 transition-colors">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 border-b border-border/50 bg-muted/30">
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("bold") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("italic") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("underline") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("heading", { level: 1 }) ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("heading", { level: 3 }) ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("blockquote") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("bulletList") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("orderedList") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive("codeBlock") ? "bg-muted text-primary font-bold" : "text-muted-foreground"
            }`}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded text-muted-foreground hover:bg-muted transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* AI Assistant Quick Trigger */}
        {onOpenAI && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIClick}
            className="rounded-full text-xs font-semibold gap-1.5 border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>AI Studio</span>
          </Button>
        )}
      </div>

      {/* Editor Surface */}
      <div className="flex-1 bg-card">
        <EditorContent editor={editor} />
      </div>

      {/* Word & Character Count Bar */}
      <div className="px-4 py-2 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">
          {words} words · {characters} characters
        </span>
        <span className="text-[11px] opacity-75">
          ~{Math.max(1, Math.ceil(words / 200))} min read
        </span>
      </div>
    </div>
  );
}
