import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { MessagingService } from "@/services/messaging.service";
import { MessagingView } from "@/components/messaging/messaging-view";

export default async function MessagesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const [conversations, pendingRequests] = await Promise.all([
    MessagingService.getUserConversations(user.id),
    MessagingService.getPendingRequests(user.id),
  ]);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <MessagingView
        currentUser={user}
        initialConversations={conversations as any}
        initialRequests={pendingRequests as any}
      />
    </div>
  );
}
