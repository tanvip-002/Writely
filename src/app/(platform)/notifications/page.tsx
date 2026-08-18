import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { NotificationService } from "@/services/notification.service";
import { NotificationsView } from "./notifications-view";

export default async function NotificationsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const notifications = await NotificationService.getUserNotifications(user.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Stay informed about new followers, favourites on your stories, and message requests.
        </p>
      </div>

      <NotificationsView initialNotifications={notifications as any} />
    </div>
  );
}
