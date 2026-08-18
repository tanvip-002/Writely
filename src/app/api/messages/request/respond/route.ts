import { NextResponse } from "next/server";
import { MessagingService } from "@/services/messaging.service";
import { requireUser } from "@/lib/auth/guards";
import { RespondRequestSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { requestId, action } = RespondRequestSchema.parse(body);

    const result = await MessagingService.respondToRequest(user.id, requestId, action);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "RESPOND_REQUEST_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
