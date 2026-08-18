"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Heart,
  UserPlus,
  MessageSquare,
  Sparkles,
  Check,
  CheckCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: string;
  read: boolean;
  referenceId: string | null;
  createdAt: string;
  actor?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
}

interface NotificationsViewProps {
  initialNotifications: NotificationItem[];
}

export function NotificationsView({ initialNotifications }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "FAVOURITE":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "FOLLOW":
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "MESSAGE_REQUEST":
      case "MESSAGE_ACCEPTED":
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  const getText = (n: NotificationItem) => {
    const actorName = n.actor?.displayName || "Someone";
    switch (n.type) {
      case "FOLLOW":
        return `${actorName} started following you.`;
      case "FAVOURITE":
        return `${actorName} added your writing to their favourites.`;
      case "MESSAGE_REQUEST":
        return `${actorName} sent you a message request.`;
      case "MESSAGE_ACCEPTED":
        return `${actorName} accepted your message request.`;
      default:
        return `New notification from ${actorName}.`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="rounded-full text-xs font-semibold gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl border border-border/60 bg-card p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg">No notifications yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            When readers favourite your work, follow your profile, or message you, updates will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markSingleRead(n.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                !n.read
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border/60 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <Avatar className="w-10 h-10 border border-border/50">
                    <AvatarImage src={n.actor?.avatarUrl || undefined} alt={n.actor?.displayName} />
                    <AvatarFallback>{n.actor?.displayName?.slice(0, 2) || "W"}</AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full shadow-2xs">
                    {getIcon(n.type)}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {getText(n)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
              </div>

              {n.actor && (
                <Link
                  href={
                    n.type === "FOLLOW"
                      ? `/u/${n.actor.username}`
                      : n.type.startsWith("MESSAGE")
                      ? "/messages"
                      : "/dashboard"
                  }
                >
                  <Button size="sm" variant="ghost" className="text-xs">
                    View
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
