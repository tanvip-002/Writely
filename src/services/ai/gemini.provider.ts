import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIProvider, AIProviderRequest, AIProviderResponse } from "./ai.provider.interface";

export class GeminiProvider implements IAIProvider {
  name = "Google Gemini";

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  }

  isAvailable(): boolean {
    const key = this.getApiKey();
    return !!key && key.trim().length > 0;
  }

  async execute(request: AIProviderRequest): Promise<AIProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("Gemini API key is not configured");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = this.buildPrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    return {
      output: output.trim(),
      metadata: {
        provider: "Gemini",
        model: "gemini-1.5-flash",
      },
    };
  }

  private buildPrompt(request: AIProviderRequest): string {
    const { tool, text, tone, context, genre } = request;

    let instructions = "";
    switch (tool) {
      case "IMPROVE":
        instructions = "Improve the following text by enhancing clarity, flow, vocabulary, and sentence cadence while preserving the original voice and meaning.";
        break;
      case "REWRITE":
        instructions = `Rewrite the following text in a ${tone || "Poetic"} tone and style.`;
        break;
      case "CONTINUE":
        instructions = "Seamlessly continue writing from where the text ends. Match the author's tone, character voice, and pacing.";
        break;
      case "SUMMARIZE":
        instructions = "Provide a compelling, concise summary of the following written work, including a one-sentence hook and a paragraph synopsis.";
        break;
      case "TITLE":
        instructions = "Generate 5 creative, compelling, and genre-appropriate titles for this piece of writing. Number each title from 1 to 5.";
        break;
      case "DESCRIPTION":
        instructions = "Generate a captivating back-cover book blurb or short excerpt description (under 150 words) suitable for publication.";
        break;
      case "GRAMMAR":
        instructions = "Review the text for grammar, spelling, punctuation, and syntax errors. Point out the specific errors and provide the corrected version.";
        break;
      case "TONE":
        instructions = "Analyze the tone, mood, emotional arc, and stylistic characteristics of this piece. Highlight key strengths and emotional undertones.";
        break;
      case "SHOW_DONT_TELL":
        instructions = "Analyze the text for passive or 'telling' sentences. Highlight up to 3 instances and provide immersive 'show, don't tell' sensory rewrites for each.";
        break;
      case "CHARACTER":
        instructions = "Based on the provided character description or text, brainstorm character traits, psychological motivations, internal conflicts, and potential character arcs.";
        break;
      case "PLOT":
        instructions = "Brainstorm 4 creative plot directions, unexpected narrative twists, central conflicts, and thematic resolutions based on this text/premise.";
        break;
      default:
        instructions = "Assist the author with improving and refining the following text.";
    }

    let fullPrompt = `${instructions}\n\n`;
    if (genre) fullPrompt += `Target Genre: ${genre}\n`;
    if (context) fullPrompt += `Additional Context: ${context}\n`;
    fullPrompt += `\n--- AUTHOR TEXT ---\n${text}\n--- END TEXT ---`;

    return fullPrompt;
  }
}
