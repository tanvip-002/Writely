import { prisma } from "@/lib/db/prisma";

export class NotificationRepository {
  static async create({
    userId,
    actorId,
    type,
    referenceId,
  }: {
    userId: string;
    actorId?: string | null;
    type: string;
    referenceId?: string | null;
  }) {
    // Avoid notifying user of their own actions
    if (actorId && actorId === userId) return null;

    return prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        referenceId,
      },
    });
  }

  static async getUserNotifications(userId: string, limit = 30) {
    return prisma.notification.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  static async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        read: true,
      },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}
