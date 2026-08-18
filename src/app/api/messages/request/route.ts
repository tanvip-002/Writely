import { NextResponse } from "next/server";
import { MessagingService } from "@/services/messaging.service";
import { requireUser } from "@/lib/auth/guards";
import { MessageRequestSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const user = await requireUser();
    const pending = await MessagingService.getPendingRequests(user.id);

    return NextResponse.json({
      success: true,
      data: { requests: pending },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { receiverId, introNote } = MessageRequestSchema.parse(body);

    const request = await MessagingService.sendRequest(user.id, receiverId, introNote);

    return NextResponse.json({
      success: true,
      data: { request },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "MESSAGE_REQUEST_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
