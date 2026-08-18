"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  User,
  Inbox,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RequestsTab } from "./requests-tab";
import { formatRelativeTime } from "@/lib/utils";
import { SessionUser } from "@/types";

interface Participant {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

interface ConversationItem {
  id: string;
  updatedAt: string;
  participants: Participant[];
  messages: MessageItem[];
}

interface MessagingViewProps {
  currentUser: SessionUser;
  initialConversations: ConversationItem[];
  initialRequests: any[];
}

export function MessagingView({
  currentUser,
  initialConversations,
  initialRequests,
}: MessagingViewProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id || null
  );
  const [activeMessages, setActiveMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [requestsCount, setRequestsCount] = useState(initialRequests.length);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for active conversation
  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages/${convId}`);
      if (res.ok) {
        const json = await res.json();
        setActiveMessages(json.data.messages || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      const interval = setInterval(() => fetchMessages(activeConversationId), 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversationId || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          content,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setActiveMessages((prev) => [...prev, json.data.message]);
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: ConversationItem) => {
    const p = conv.participants.find((p) => p.user.id !== currentUser.id);
    return p?.user || { displayName: "Writer", username: "writer", avatarUrl: null };
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeOtherUser = activeConversation ? getOtherParticipant(activeConversation) : null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[550px] flex flex-col">
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/20">
          <h1 className="font-serif text-xl font-bold">Messages</h1>
          <TabsList className="bg-muted/70">
            <TabsTrigger value="chats" className="text-xs gap-1.5 font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Conversations</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs gap-1.5 font-semibold relative">
              <Inbox className="w-3.5 h-3.5" />
              <span>Requests</span>
              {requestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {requestsCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Conversations & Active Chat */}
        <TabsContent value="chats" className="flex-1 flex flex-col md:flex-row min-h-0 m-0">
          {/* Conversation List Sidebar */}
          <div className="w-full md:w-80 border-r border-border/50 overflow-y-auto flex flex-col divide-y divide-border/30 bg-muted/10 shrink-0">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto opacity-40 mb-2" />
                <p className="font-medium">No conversations yet.</p>
                <p>Send a message request from another writer's profile to start chatting.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = conv.id === activeConversationId;
                const lastMsg = conv.messages[0];

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`flex items-start gap-3 p-4 text-left transition-colors w-full ${
                      isSelected
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={other.avatarUrl || undefined} alt={other.displayName} />
                      <AvatarFallback>{other.displayName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold truncate text-foreground">
                          {other.displayName}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatRelativeTime(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {lastMsg ? lastMsg.content : "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Chat Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-background">
            {activeOtherUser ? (
              <>
                {/* Chat Top Header */}
                <div className="px-6 py-3 border-b border-border/50 flex items-center justify-between bg-card/60">
                  <Link
                    href={`/u/${activeOtherUser.username}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={activeOtherUser.avatarUrl || undefined} />
                      <AvatarFallback>{activeOtherUser.displayName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {activeOtherUser.displayName}
                      </h2>
                      <p className="text-xs text-muted-foreground">@{activeOtherUser.username}</p>
                    </div>
                  </Link>

                  <Link href={`/u/${activeOtherUser.username}`}>
                    <Button size="sm" variant="ghost" className="text-xs">
                      View Profile
                    </Button>
                  </Link>
                </div>

                {/* Chat Messages Flow */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {activeMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-8 text-xs text-muted-foreground">
                      <div>
                        <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2 opacity-60" />
                        <p className="font-semibold text-sm text-foreground">Message request accepted</p>
                        <p className="mt-1">You can now exchange messages privately.</p>
                      </div>
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-2.5 max-w-[80%] ${
                            isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                            <AvatarImage src={msg.sender.avatarUrl || undefined} />
                            <AvatarFallback>{msg.sender.displayName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-tr-xs"
                                  : "bg-muted/70 text-foreground rounded-tl-xs"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <span
                              className={`text-[10px] text-muted-foreground block mt-1 ${
                                isMe ? "text-right" : "text-left"
                              }`}
                            >
                              {formatRelativeTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-border/50 bg-card flex items-center gap-2"
                >
                  <Input
                    placeholder={`Message ${activeOtherUser.displayName}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-full text-xs sm:text-sm h-10 px-4"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={sending || !newMessage.trim()}
                    className="rounded-full h-10 px-4 gap-1.5 font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center text-xs text-muted-foreground">
                Select a conversation to start chatting.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Pending Message Requests */}
        <TabsContent value="requests" className="flex-1 overflow-y-auto p-6 m-0">
          <RequestsTab
            initialRequests={initialRequests}
            onRequestHandled={() => setRequestsCount((prev) => Math.max(0, prev - 1))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
