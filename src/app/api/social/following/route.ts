import { NextResponse } from "next/server";
import { SocialService } from "@/services/social.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, error: { message: "User ID required" } }, { status: 400 });
    }

    const following = await SocialService.getFollowing(userId);
    return NextResponse.json({
      success: true,
      data: { users: following.map((f) => f.following) },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 500 }
    );
  }
}
