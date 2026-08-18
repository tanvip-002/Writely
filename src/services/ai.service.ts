import { prisma } from "@/lib/db/prisma";
import { IAIProvider, AIProviderRequest } from "./ai/ai.provider.interface";
import { GeminiProvider } from "./ai/gemini.provider";
import { OpenAIProvider } from "./ai/openai.provider";
import { LocalIntelligentProvider } from "./ai/local-mock.provider";
import { AIOperationResult } from "@/types";

export class AIService {
  private static providers: IAIProvider[] = [
    new GeminiProvider(),
    new OpenAIProvider(),
    new LocalIntelligentProvider(),
  ];

  private static getActiveProvider(): IAIProvider {
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        return provider;
      }
    }
    return new LocalIntelligentProvider();
  }

  static async checkAndIncrementUsage(userId: string, dailyLimit = 30): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.aIUsage.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (usage && usage.count >= dailyLimit) {
      throw new Error(`Daily AI request limit (${dailyLimit}/day) reached. Please try again tomorrow.`);
    }

    await prisma.aIUsage.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      create: {
        userId,
        date: today,
        count: 1,
      },
      update: {
        count: { increment: 1 },
      },
    });
  }

  static async getUsageStatus(userId: string, dailyLimit = 30) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.aIUsage.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    const used = usage?.count || 0;
    return {
      used,
      limit: dailyLimit,
      remaining: Math.max(0, dailyLimit - used),
    };
  }

  static async executeTool(
    userId: string,
    request: AIProviderRequest
  ): Promise<AIOperationResult> {
    // 1. Enforce usage limits
    await this.checkAndIncrementUsage(userId);

    // 2. Select Provider
    const provider = this.getActiveProvider();

    // 3. Log request
    await prisma.aIRequest.create({
      data: {
        userId,
        tool: request.tool,
        inputSize: request.text.length,
      },
    });

    // 4. Execute
    const response = await provider.execute(request);

    return {
      tool: request.tool,
      originalText: request.text,
      output: response.output,
      metadata: {
        ...response.metadata,
        providerName: provider.name,
      },
    };
  }
}
