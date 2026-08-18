import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { getSessionUser } from "@/lib/auth/session";
import { AIServiceSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    // Allow demo usage for guest with fallback ID or require authenticated user
    const userId = user?.id || "guest_demo_user";

    const body = await req.json();
    const validated = AIServiceSchema.parse(body);

    const result = await AIService.executeTool(userId, {
      tool: validated.tool,
      text: validated.text,
      tone: validated.tone,
      context: validated.context,
      genre: validated.genre,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "AI_PROCESSING_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
