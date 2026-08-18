import { afterEach, describe, it, expect } from "vitest";
import { AIService } from "@/services/ai.service";
import { GeminiProvider } from "@/services/ai/gemini.provider";
import { LocalIntelligentProvider } from "@/services/ai/local-mock.provider";
import { OpenAIProvider } from "@/services/ai/openai.provider";

describe("AI Writing Studio Providers & Craft Tools", () => {
  const provider = new LocalIntelligentProvider();
  const originalEnv = { ...process.env };

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  it("is always available as reliable local engine", () => {
    expect(provider.isAvailable()).toBe(true);
  });

  it("prefers configured OpenAI provider when available", () => {
    process.env.OPENAI_API_KEY = "test-openai-key";
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_API_KEY;

    expect(new OpenAIProvider().isAvailable()).toBe(true);
    expect(AIService.getActiveProvider()).toBeInstanceOf(OpenAIProvider);
  });

  it("falls back to Gemini when OpenAI is absent", () => {
    delete process.env.OPENAI_API_KEY;
    process.env.GEMINI_API_KEY = "test-gemini-key";
    delete process.env.AI_API_KEY;

    expect(new GeminiProvider().isAvailable()).toBe(true);
    expect(AIService.getActiveProvider()).toBeInstanceOf(GeminiProvider);
  });

  it("falls back to the local provider when no external API keys are configured", () => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_API_KEY;

    expect(AIService.getActiveProvider()).toBeInstanceOf(LocalIntelligentProvider);
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
