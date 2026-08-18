import { prisma } from "@/lib/db/prisma";
import { WritingType, Visibility, WritingStatus, Prisma } from "@prisma/client";

export class WritingRepository {
  static async findById(id: string) {
    return prisma.writing.findUnique({
      where: { id },
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
    });
  }

  static async findBySlug(slug: string) {
    return prisma.writing.findUnique({
      where: { slug },
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
    });
  }

  static async create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    writingType: WritingType;
    visibility: Visibility;
    status: WritingStatus;
    coverImage?: string | null;
    wordCount: number;
    readingTime: number;
    authorId: string;
    genreId?: string | null;
    tags?: string[];
  }) {
    const { tags, ...rest } = data;

    return prisma.writing.create({
      data: {
        ...rest,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        tags: tags && tags.length > 0
          ? {
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName.toLowerCase().trim() },
                    create: { name: tagName.toLowerCase().trim() },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        genre: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  static async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string | null;
      writingType?: WritingType;
      visibility?: Visibility;
      status?: WritingStatus;
      coverImage?: string | null;
      wordCount?: number;
      readingTime?: number;
      genreId?: string | null;
      tags?: string[];
    }
  ) {
    const { tags, ...rest } = data;

    // If tags are provided, update the relations
    if (tags) {
      await prisma.writingTag.deleteMany({
        where: { writingId: id },
      });
    }

    return prisma.writing.update({
      where: { id },
      data: {
        ...rest,
        publishedAt:
          data.status === "PUBLISHED"
            ? new Date()
            : data.status === "DRAFT"
            ? null
            : undefined,
        tags:
          tags && tags.length > 0
            ? {
                create: tags.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName.toLowerCase().trim() },
                      create: { name: tagName.toLowerCase().trim() },
                    },
                  },
                })),
              }
            : undefined,
      },
      include: {
        author: true,
        genre: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return prisma.writing.delete({
      where: { id },
    });
  }

  static async getFeed({
    type = "all",
    userId,
    cursor,
    limit = 10,
  }: {
    type?: "all" | "following" | "popular" | "recent";
    userId?: string | null;
    cursor?: string;
    limit?: number;
  }) {
    const whereClause: Prisma.WritingWhereInput = {
      visibility: "PUBLIC",
      status: "PUBLISHED",
    };

    if (type === "following" && userId) {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = following.map((f) => f.followingId);
      whereClause.authorId = { in: followingIds };
    }

    let orderBy: Prisma.WritingOrderByWithRelationInput | Prisma.WritingOrderByWithRelationInput[] = {
      publishedAt: "desc",
    };

    if (type === "popular") {
      orderBy = [
        { favourites: { _count: "desc" } },
        { publishedAt: "desc" },
      ];
    }

    const items = await prisma.writing.findMany({
      where: whereClause,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy,
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
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items,
      nextCursor,
    };
  }

  static async getUserWritings({
    authorId,
    currentUserId,
    status,
    visibility,
    writingType,
    page = 1,
    limit = 12,
  }: {
    authorId: string;
    currentUserId?: string | null;
    status?: WritingStatus;
    visibility?: Visibility;
    writingType?: WritingType;
    page?: number;
    limit?: number;
  }) {
    const isOwner = currentUserId === authorId;

    const where: Prisma.WritingWhereInput = {
      authorId,
    };

    if (isOwner) {
      if (status) where.status = status;
      if (visibility) where.visibility = visibility;
    } else {
      // Non-owners can ONLY ever see PUBLIC and PUBLISHED
      where.visibility = "PUBLIC";
      where.status = "PUBLISHED";
    }

    if (writingType) {
      where.writingType = writingType;
    }

    const total = await prisma.writing.count({ where });
    const items = await prisma.writing.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
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
    });

    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  }

  static async search({
    query,
    writingType,
    genre,
    tag,
    author,
    sortBy = "relevance",
    page = 1,
    limit = 12,
  }: {
    query?: string;
    writingType?: WritingType;
    genre?: string;
    tag?: string;
    author?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.WritingWhereInput = {
      visibility: "PUBLIC",
      status: "PUBLISHED",
    };

    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { author: { username: { contains: q, mode: "insensitive" } } },
        { author: { displayName: { contains: q, mode: "insensitive" } } },
        { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
      ];
    }

    if (writingType) where.writingType = writingType;
    if (genre) where.genre = { slug: genre };
    if (tag) where.tags = { some: { tag: { name: tag.toLowerCase() } } };
    if (author) where.author = { username: author.toLowerCase() };

    let orderBy: Prisma.WritingOrderByWithRelationInput | Prisma.WritingOrderByWithRelationInput[] = {
      publishedAt: "desc",
    };

    if (sortBy === "popular") {
      orderBy = [{ favourites: { _count: "desc" } }, { publishedAt: "desc" }];
    } else if (sortBy === "words") {
      orderBy = { wordCount: "desc" };
    }

    const total = await prisma.writing.count({ where });
    const items = await prisma.writing.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
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
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getMoreFromAuthor(authorId: string, currentWritingId: string, limit = 3) {
    return prisma.writing.findMany({
      where: {
        authorId,
        id: { not: currentWritingId },
        visibility: "PUBLIC",
        status: "PUBLISHED",
      },
      take: limit,
      orderBy: { publishedAt: "desc" },
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
        _count: {
          select: {
            favourites: true,
          },
        },
      },
    });
  }
}
