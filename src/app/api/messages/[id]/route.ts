import { NextResponse } from "next/server";
import { MessagingService } from "@/services/messaging.service";
import { requireUser } from "@/lib/auth/guards";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const conversation = await MessagingService.getConversationById(id, user.id);

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 404 }
    );
  }
}
