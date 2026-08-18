"use client";

import { useState, useEffect } from "react";
import { Bell, Heart, UserPlus, MessageSquare, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data.notifications || []);
        setUnreadCount(json.data.unreadCount || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "FAVOURITE":
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case "FOLLOW":
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case "MESSAGE_REQUEST":
      case "MESSAGE_ACCEPTED":
        return <MessageSquare className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const getText = (n: NotificationItem) => {
    const actorName = n.actor?.displayName || "Someone";
    switch (n.type) {
      case "FOLLOW":
        return `${actorName} started following you`;
      case "FAVOURITE":
        return `${actorName} favourited your writing`;
      case "MESSAGE_REQUEST":
        return `${actorName} sent you a message request`;
      case "MESSAGE_ACCEPTED":
        return `${actorName} accepted your message request`;
      default:
        return `New notification from ${actorName}`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-destructive rounded-full shadow-xs animate-in zoom-in-50">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 rounded-xl shadow-xl border border-border/60 bg-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/30">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={
                  n.type === "FOLLOW" && n.actor
                    ? `/u/${n.actor.username}`
                    : n.type === "MESSAGE_REQUEST" || n.type === "MESSAGE_ACCEPTED"
                    ? "/messages"
                    : "/dashboard"
                }
                className={`flex items-start gap-3 p-3.5 hover:bg-muted/40 transition-colors ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={n.actor?.avatarUrl || undefined} />
                    <AvatarFallback>{n.actor?.displayName?.slice(0, 2) || "W"}</AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full shadow-xs">
                    {getIcon(n.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-medium leading-snug">
                    {getText(n)}
                  </p>
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border/50 bg-muted/20 text-center">
          <Link
            href="/notifications"
            className="text-xs text-primary font-medium hover:underline block py-1"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
