"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserSummary {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
  title: string;
}

export function FollowersModal({
  isOpen,
  onClose,
  userId,
  type,
  title,
}: FollowersModalProps) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/social/${type}?userId=${userId}`);
        if (res.ok) {
          const json = await res.json();
          setUsers(json.data.users || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, userId, type]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[350px] overflow-y-auto divide-y divide-border/40">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading {type}...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No {type} yet.
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 hover:bg-muted/40 transition-colors"
              >
                <Link
                  href={`/u/${u.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 min-w-0 flex-1 group"
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={u.avatarUrl || undefined} alt={u.displayName} />
                    <AvatarFallback>{u.displayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                      {u.displayName}
                    </span>
                    <span className="text-xs text-muted-foreground block truncate">
                      @{u.username}
                    </span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
