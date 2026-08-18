"use client";

import { useState } from "react";
import { MessageSquare, Send, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiver: {
    id: string;
    displayName: string;
    username: string;
  };
  onRequestSent?: () => void;
}

export function MessageRequestModal({
  isOpen,
  onClose,
  receiver,
  onRequestSent,
}: MessageRequestModalProps) {
  const [introNote, setIntroNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/messages/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: receiver.id,
          introNote: introNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to send message request");
      }

      setSuccess(true);
      onRequestSent?.();
      setTimeout(() => {
        setSuccess(false);
        setIntroNote("");
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Send Message Request
          </DialogTitle>
          <DialogDescription>
            Introduce yourself to <strong className="text-foreground">{receiver.displayName}</strong> (@{receiver.username}). Once they accept your request, you can exchange private messages.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg">Request Sent</h4>
            <p className="text-xs text-muted-foreground">
              {receiver.displayName} has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="intro" className="text-xs font-semibold text-foreground">
                Introduction Note (Optional)
              </label>
              <Textarea
                id="intro"
                placeholder="Hi! I loved your poem on..."
                value={introNote}
                onChange={(e) => setIntroNote(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <span className="text-[11px] text-muted-foreground block text-right">
                {introNote.length}/500
              </span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-1.5 font-semibold">
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? "Sending..." : "Send Request"}</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
