"use client";

import { useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  currentUserId?: string | null;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
  currentUserId,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }

    const nextState = !isFollowing;
    setIsFollowing(nextState);
    onFollowChange?.(nextState);

    try {
      setLoading(true);
      const res = await fetch("/api/social/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) {
        const json = await res.json();
        setIsFollowing(json.data.isFollowing);
        onFollowChange?.(json.data.isFollowing);
      }
    } catch {
      setIsFollowing(!nextState);
      onFollowChange?.(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className="rounded-full text-xs font-semibold gap-1.5 min-w-[95px] shadow-xs"
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Follow</span>
        </>
      )}
    </Button>
  );
}
