import { prisma } from "@/lib/db/prisma";

export class SocialRepository {
  // Following
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  }

  static async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }

    return prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
      create: {
        followerId,
        followingId,
      },
      update: {},
    });
  }

  static async unfollow(followerId: string, followingId: string) {
    return prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  }

  static async getFollowers(userId: string, limit = 50) {
    return prisma.follow.findMany({
      where: { followingId: userId },
      take: limit,
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });
  }

  static async getFollowing(userId: string, limit = 50) {
    return prisma.follow.findMany({
      where: { followerId: userId },
      take: limit,
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });
  }

  // Favourites
  static async isFavourited(userId: string, writingId: string): Promise<boolean> {
    const fav = await prisma.favourite.findUnique({
      where: {
        userId_writingId: {
          userId,
          writingId,
        },
      },
    });
    return !!fav;
  }

  static async toggleFavourite(userId: string, writingId: string) {
    const existing = await prisma.favourite.findUnique({
      where: {
        userId_writingId: {
          userId,
          writingId,
        },
      },
    });

    if (existing) {
      await prisma.favourite.delete({
        where: {
          userId_writingId: {
            userId,
            writingId,
          },
        },
      });
      return { favourited: false };
    } else {
      await prisma.favourite.create({
        data: {
          userId,
          writingId,
        },
      });
      return { favourited: true };
    }
  }

  static async getUserFavourites({
    userId,
    writingType,
    genre,
    page = 1,
    limit = 12,
  }: {
    userId: string;
    writingType?: string;
    genre?: string;
    page?: number;
    limit?: number;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId,
      writing: {
        visibility: "PUBLIC",
        status: "PUBLISHED",
      },
    };

    if (writingType) {
      where.writing.writingType = writingType;
    }

    if (genre) {
      where.writing.genre = { slug: genre };
    }

    const total = await prisma.favourite.count({ where });
    const items = await prisma.favourite.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        writing: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
              },
            },
            genre: true,
            tags: {
              include: {
                tag: true,
              },
            },
            _count: {
              select: {
                favourites: true,
              },
            },
          },
        },
      },
    });

    return {
      items: items.map((i) => i.writing),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
