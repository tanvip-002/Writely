import { NextResponse } from "next/server";
import { WritingService } from "@/services/writing.service";
import { requireUser } from "@/lib/auth/guards";
import { getSessionUser } from "@/lib/auth/session";
import { CreateWritingSchema } from "@/lib/validation/schemas";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") as "all" | "following" | "popular" | "recent") || "all";
    const cursor = searchParams.get("cursor") || undefined;
    const limit = Number(searchParams.get("limit")) || 10;

    const user = await getSessionUser();

    const result = await WritingService.getFeed({
      type,
      userId: user?.id,
      cursor,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FEED_FETCH_ERROR", message: (err as Error).message },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const validated = CreateWritingSchema.parse(body);

    const writing = await WritingService.createWriting(user.id, validated);

    return NextResponse.json({
      success: true,
      data: { writing },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "CREATE_WRITING_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
