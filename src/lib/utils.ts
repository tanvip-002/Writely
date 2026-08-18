import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return base ? `${base}-${randomSuffix}` : `writing-${randomSuffix}`;
}

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  // Strip HTML tags if any
  const cleanText = content.replace(/<[^>]*>?/gm, "");
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function calculateWordCount(content: string): number {
  if (!content) return 0;
  const cleanText = content.replace(/<[^>]*>?/gm, "");
  return cleanText.trim().split(/\s+/).filter(Boolean).length;
}

export function generateExcerpt(content: string, maxLength: number = 180): string {
  if (!content) return "";
  const cleanText = content.replace(/<[^>]*>?/gm, "").trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.slice(0, maxLength).trim() + "...";
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(d);
}
