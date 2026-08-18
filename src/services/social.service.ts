import { SocialRepository } from "@/repositories/social.repository";
import { NotificationRepository } from "@/repositories/notification.repository";
import { WritingRepository } from "@/repositories/writing.repository";

export class SocialService {
  static async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new Error("You cannot follow yourself");
    }

    const follow = await SocialRepository.follow(currentUserId, targetUserId);

    // Create notification
    await NotificationRepository.create({
      userId: targetUserId,
      actorId: currentUserId,
      type: "FOLLOW",
      referenceId: currentUserId,
    });

    return follow;
  }

  static async unfollowUser(currentUserId: string, targetUserId: string) {
    return SocialRepository.unfollow(currentUserId, targetUserId);
  }

  static async toggleFavourite(userId: string, writingId: string) {
    const writing = await WritingRepository.findById(writingId);
    if (!writing) throw new Error("Writing not found");

    if (writing.visibility === "PRIVATE" && writing.authorId !== userId) {
      throw new Error("Cannot favourite a private writing");
    }

    const result = await SocialRepository.toggleFavourite(userId, writingId);

    // If favourited, notify author
    if (result.favourited && writing.authorId !== userId) {
      await NotificationRepository.create({
        userId: writing.authorId,
        actorId: userId,
        type: "FAVOURITE",
        referenceId: writing.id,
      });
    }

    return result;
  }

  static async getUserFavourites(params: {
    userId: string;
    writingType?: string;
    genre?: string;
    page?: number;
    limit?: number;
  }) {
    return SocialRepository.getUserFavourites(params);
  }

  static async getFollowers(userId: string) {
    return SocialRepository.getFollowers(userId);
  }

  static async getFollowing(userId: string) {
    return SocialRepository.getFollowing(userId);
  }
}
