import { NextResponse } from "next/server";
import { MessagingService } from "@/services/messaging.service";
import { requireUser } from "@/lib/auth/guards";

export async function GET() {
  try {
    const user = await requireUser();
    const conversations = await MessagingService.getUserConversations(user.id);

    return NextResponse.json({
      success: true,
      data: { conversations },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 401 }
    );
  }
}
