import { NextResponse } from "next/server";
import { SocialService } from "@/services/social.service";
import { requireUser } from "@/lib/auth/guards";
import { FavouriteWritingSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { writingId } = FavouriteWritingSchema.parse(body);

    const result = await SocialService.toggleFavourite(user.id, writingId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FAVOURITE_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
