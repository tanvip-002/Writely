import { MessagingRepository } from "@/repositories/messaging.repository";
import { NotificationRepository } from "@/repositories/notification.repository";
import { ForbiddenError, NotFoundError } from "@/lib/auth/guards";

export class MessagingService {
  static async sendRequest(senderId: string, receiverId: string, introNote?: string | null) {
    if (senderId === receiverId) {
      throw new Error("Cannot send a request to yourself");
    }

    const request = await MessagingRepository.sendRequest(senderId, receiverId, introNote);

    await NotificationRepository.create({
      userId: receiverId,
      actorId: senderId,
      type: "MESSAGE_REQUEST",
      referenceId: request.id,
    });

    return request;
  }

  static async respondToRequest(
    userId: string,
    requestId: string,
    action: "ACCEPT" | "DECLINE" | "BLOCK"
  ) {
    const request = await MessagingRepository.getRequestById(requestId);
    if (!request) throw new NotFoundError("Message request not found");

    if (request.receiverId !== userId) {
      throw new ForbiddenError("You are not the recipient of this message request");
    }

    const result = await MessagingRepository.respondToRequest(requestId, action);

    if (action === "ACCEPT") {
      await NotificationRepository.create({
        userId: request.senderId,
        actorId: userId,
        type: "MESSAGE_ACCEPTED",
        referenceId: result.conversation?.id,
      });
    }

    return result;
  }

  static async getPendingRequests(userId: string) {
    return MessagingRepository.getPendingRequests(userId);
  }

  static async getSentRequests(userId: string) {
    return MessagingRepository.getSentRequests(userId);
  }

  static async getUserConversations(userId: string) {
    return MessagingRepository.getUserConversations(userId);
  }

  static async getConversationById(id: string, userId: string) {
    const conversation = await MessagingRepository.getConversationById(id, userId);
    if (!conversation) throw new NotFoundError("Conversation not found or unauthorized");
    return conversation;
  }

  static async sendMessage(userId: string, conversationId: string, content: string) {
    return MessagingRepository.sendMessage(conversationId, userId, content.trim());
  }
}
