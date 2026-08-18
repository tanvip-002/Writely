import { describe, it, expect } from "vitest";
import {
  calculateReadingTime,
  calculateWordCount,
  generateExcerpt,
  slugify,
} from "@/lib/utils";

describe("Utility Functions", () => {
  it("calculates word count accurately stripping HTML", () => {
    const text = "<p>The quick brown <strong>fox</strong> jumps over the lazy dog.</p>";
    expect(calculateWordCount(text)).toBe(9);
  });

  it("calculates reading time at 200 wpm with minimum 1 min", () => {
    expect(calculateReadingTime("Short poem.")).toBe(1);
    const longText = Array(450).fill("word").join(" ");
    expect(calculateReadingTime(longText)).toBe(3);
  });

  it("generates clean excerpts", () => {
    const content = "<p>This is the first sentence. And this is the second sentence that continues on for a very long time.</p>";
    const excerpt = generateExcerpt(content, 30);
    expect(excerpt.length).toBeLessThanOrEqual(35);
    expect(excerpt).toContain("...");
  });

  it("generates url-friendly slugs", () => {
    const slug = slugify("The Midnight Train To Oban!");
    expect(slug).toMatch(/^the-midnight-train-to-oban-[a-z0-9]+$/);
  });
});
