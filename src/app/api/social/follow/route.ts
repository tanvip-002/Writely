import { NextResponse } from "next/server";
import { SocialService } from "@/services/social.service";
import { requireUser } from "@/lib/auth/guards";
import { FollowUserSchema } from "@/lib/validation/schemas";
import { SocialRepository } from "@/repositories/social.repository";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { targetUserId } = FollowUserSchema.parse(body);

    const isFollowing = await SocialRepository.isFollowing(user.id, targetUserId);

    if (isFollowing) {
      await SocialService.unfollowUser(user.id, targetUserId);
      return NextResponse.json({
        success: true,
        data: { isFollowing: false },
      });
    } else {
      await SocialService.followUser(user.id, targetUserId);
      return NextResponse.json({
        success: true,
        data: { isFollowing: true },
      });
    }
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FOLLOW_ACTION_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}
