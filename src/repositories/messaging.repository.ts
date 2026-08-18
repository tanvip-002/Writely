import { prisma } from "@/lib/db/prisma";

export class MessagingRepository {
  // Requests
  static async getRequest(senderId: string, receiverId: string) {
    return prisma.messageRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });
  }

  static async getRequestById(id: string) {
    return prisma.messageRequest.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  static async sendRequest(senderId: string, receiverId: string, introNote?: string | null) {
    if (senderId === receiverId) {
      throw new Error("Cannot send a message request to yourself");
    }

    return prisma.messageRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
      create: {
        senderId,
        receiverId,
        introNote,
        status: "PENDING",
      },
      update: {
        introNote,
        status: "PENDING",
        updatedAt: new Date(),
      },
      include: {
        sender: {
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

  static async getPendingRequests(userId: string) {
    return prisma.messageRequest.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
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

  static async getSentRequests(userId: string) {
    return prisma.messageRequest.findMany({
      where: {
        senderId: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        receiver: {
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

  static async respondToRequest(requestId: string, action: "ACCEPT" | "DECLINE" | "BLOCK") {
    const status = action === "ACCEPT" ? "ACCEPTED" : action === "DECLINE" ? "DECLINED" : "BLOCKED";

    const request = await prisma.messageRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // If accepted, create or activate conversation
    if (status === "ACCEPTED") {
      let conversation = await prisma.conversation.findUnique({
        where: { requestId: request.id },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            requestId: request.id,
            participants: {
              create: [
                { userId: request.senderId },
                { userId: request.receiverId },
              ],
            },
          },
        });
      }
      return { request, conversation };
    }

    return { request, conversation: null };
  }

  // Conversations
  static async getUserConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });
  }

  static async getConversationById(id: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) return null;
    const isParticipant = conversation.participants.some((p) => p.userId === userId);
    if (!isParticipant) return null;

    return conversation;
  }

  static async sendMessage(conversationId: string, senderId: string, content: string) {
    // Verify participation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: senderId,
        },
      },
    });

    if (!participant) {
      throw new Error("You are not a participant in this conversation");
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}
