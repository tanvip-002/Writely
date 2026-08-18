import { NextResponse } from "next/server";
import { MessagingService } from "@/services/messaging.service";
import { requireUser } from "@/lib/auth/guards";
import { SendMessageSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { conversationId, content } = SendMessageSchema.parse(body);

    const message = await MessagingService.sendMessage(user.id, conversationId, content);

    return NextResponse.json({
      success: true,
      data: { message },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SEND_MESSAGE_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
