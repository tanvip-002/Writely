import OpenAI from "openai";
import { IAIProvider, AIProviderRequest, AIProviderResponse } from "./ai.provider.interface";

export class OpenAIProvider implements IAIProvider {
  name = "OpenAI GPT";

  private getApiKey(): string | undefined {
    return process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  }

  isAvailable(): boolean {
    const key = this.getApiKey();
    return !!key && key.trim().length > 0;
  }

  async execute(request: AIProviderRequest): Promise<AIProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("OpenAI API key is not configured");

    const openai = new OpenAI({ apiKey });
    const prompt = this.buildPrompt(request);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an elite literary editor, creative writing mentor, and writing assistant on Writely.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const output = completion.choices[0]?.message?.content || "";

    return {
      output: output.trim(),
      metadata: {
        provider: "OpenAI",
        model: "gpt-4o-mini",
      },
    };
  }

  private buildPrompt(request: AIProviderRequest): string {
    const { tool, text, tone, context, genre } = request;
    return `Task: ${tool}
Tone: ${tone || "Default"}
Genre: ${genre || "General"}
Context: ${context || "None"}
Text:
${text}`;
  }
}
