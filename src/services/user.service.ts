import { UserRepository } from "@/repositories/user.repository";
import { SocialRepository } from "@/repositories/social.repository";
import { MessagingRepository } from "@/repositories/messaging.repository";
import { UserProfileData } from "@/types";

export class UserService {
  static async getProfileByUsername(
    username: string,
    currentUserId?: string | null
  ): Promise<UserProfileData | null> {
    const user = await UserRepository.findByUsername(username);
    if (!user) return null;

    let isFollowing = false;
    let hasPendingRequest = false;
    let canMessage = false;

    if (currentUserId && currentUserId !== user.id) {
      isFollowing = await SocialRepository.isFollowing(currentUserId, user.id);
      
      const request = await MessagingRepository.getRequest(currentUserId, user.id);
      const reverseRequest = await MessagingRepository.getRequest(user.id, currentUserId);

      if (request?.status === "PENDING" || reverseRequest?.status === "PENDING") {
        hasPendingRequest = true;
      }
      if (request?.status === "ACCEPTED" || reverseRequest?.status === "ACCEPTED") {
        canMessage = true;
      }
    }

    const genreList = user.genres ? user.genres.split(",").map((g) => g.trim()).filter(Boolean) : [];

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      location: user.location,
      website: user.website,
      genres: genreList,
      writerType: user.writerType,
      createdAt: user.createdAt,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      writingsCount: user._count.writings,
      isFollowing,
      hasPendingRequest,
      canMessage,
    };
  }

  static async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      bio?: string | null;
      avatarUrl?: string | null;
      location?: string | null;
      website?: string | null;
      genres?: string[];
      writerType?: string | null;
    }
  ) {
    const genresString = data.genres ? data.genres.join(",") : undefined;

    return UserRepository.updateProfile(userId, {
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      location: data.location,
      website: data.website,
      genres: genresString,
      writerType: data.writerType,
    });
  }

  static async getFeaturedWriters(limit = 6) {
    return UserRepository.getFeaturedWriters(limit);
  }
}
