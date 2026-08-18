import { prisma } from "@/lib/db/prisma";

export class UserRepository {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            writings: {
              where: {
                visibility: "PUBLIC",
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  static async findByEmailOrUsername(emailOrUsername: string) {
    const term = emailOrUsername.toLowerCase();
    return prisma.user.findFirst({
      where: {
        OR: [{ email: term }, { username: term }],
      },
    });
  }

  static async create(data: {
    username: string;
    email: string;
    passwordHash: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
  }) {
    return prisma.user.create({
      data: {
        username: data.username.toLowerCase(),
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
    });
  }

  static async updateProfile(
    id: string,
    data: {
      displayName?: string;
      bio?: string | null;
      avatarUrl?: string | null;
      location?: string | null;
      website?: string | null;
      genres?: string | undefined;
      writerType?: string | null;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  static async searchUsers(query: string, limit = 10) {
    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query } },
          { displayName: { contains: query } },
          { bio: { contains: query } },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            writings: {
              where: {
                visibility: "PUBLIC",
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      take: limit,
    });
  }

  static async getFeaturedWriters(limit = 6) {
    return prisma.user.findMany({
      take: limit,
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            writings: {
              where: {
                visibility: "PUBLIC",
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    });
  }
}
