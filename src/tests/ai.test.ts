import { describe, it, expect } from "vitest";
import { LocalIntelligentProvider } from "@/services/ai/local-mock.provider";

describe("AI Writing Studio Providers & Craft Tools", () => {
  const provider = new LocalIntelligentProvider();

  it("is always available as reliable local engine", () => {
    expect(provider.isAvailable()).toBe(true);
  });

  it("improves writing clarity and vocabulary", async () => {
    const res = await provider.execute({
      tool: "IMPROVE",
      text: "The man walked into the room. It was very cold.",
    });
    expect(res.output).toBeDefined();
    expect(res.output).toContain("stepped into");
    expect(res.output).toContain("exceedingly");
  });

  it("rewrites with poetic tone", async () => {
    const res = await provider.execute({
      tool: "REWRITE",
      text: "The rain fell on the quiet street.",
      tone: "Poetic",
    });
    expect(res.output).toContain("Beneath the quiet canopy");
  });

  it("generates 5 creative titles", async () => {
    const res = await provider.execute({
      tool: "TITLE",
      text: "A story about time and lost memories.",
    });
    expect(res.output).toContain("1.");
    expect(res.output).toContain("5.");
  });

  it("performs show-don't-tell sensory transformation", async () => {
    const res = await provider.execute({
      tool: "SHOW_DONT_TELL",
      text: "She was nervous and cold.",
    });
    expect(res.output).toContain("Sensory Rewrite");
  });

  it("generates character development blueprints", async () => {
    const res = await provider.execute({
      tool: "CHARACTER",
      text: "A reclusive clockmaker who refuses to leave the bell tower.",
    });
    expect(res.output).toContain("Core Archetype");
    expect(res.output).toContain("Inner Conflict");
  });

  it("brainstorms plot twists and conflicts", async () => {
    const res = await provider.execute({
      tool: "PLOT",
      text: "Two astronomers discover an artificial transmission from Mars.",
    });
    expect(res.output).toContain("The Hidden Motive");
    expect(res.output).toContain("The Climactic Choice");
  });
});
