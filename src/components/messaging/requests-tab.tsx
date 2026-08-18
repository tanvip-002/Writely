"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ShieldAlert, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface RequestItem {
  id: string;
  introNote: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  };
}

interface RequestsTabProps {
  initialRequests: RequestItem[];
  onRequestHandled?: (requestId: string, action: string) => void;
}

export function RequestsTab({ initialRequests, onRequestHandled }: RequestsTabProps) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (requestId: string, action: "ACCEPT" | "DECLINE" | "BLOCK") => {
    try {
      setLoadingId(requestId);
      const res = await fetch("/api/messages/request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        onRequestHandled?.(requestId, action);
      }
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-semibold text-base">No pending message requests</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          When other writers wish to start a private conversation with you, their requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="p-5 rounded-xl border border-border/60 bg-card space-y-3 shadow-xs hover:border-primary/30 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href={`/u/${req.sender.username}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={req.sender.avatarUrl || undefined} alt={req.sender.displayName} />
                <AvatarFallback>{req.sender.displayName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors block">
                  {req.sender.displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{req.sender.username} · {formatRelativeTime(req.createdAt)}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={loadingId === req.id}
                onClick={() => handleAction(req.id, "DECLINE")}
                className="rounded-lg text-xs gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline</span>
              </Button>

              <Button
                size="sm"
                disabled={loadingId === req.id}
                onClick={() => handleAction(req.id, "ACCEPT")}
                className="rounded-lg text-xs gap-1 font-semibold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept</span>
              </Button>
            </div>
          </div>

          {req.introNote && (
            <div className="p-3 rounded-lg bg-muted/40 text-xs text-foreground/90 border border-border/40 italic">
              "{req.introNote}"
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
