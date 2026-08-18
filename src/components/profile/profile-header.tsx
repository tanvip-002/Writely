"use client";

import { useState } from "react";
import { MessageSquare, MapPin, Globe, Calendar, Settings, Feather, Check } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "./follow-button";
import { MessageRequestModal } from "./message-request-modal";
import { FollowersModal } from "./followers-modal";
import { formatDate } from "@/lib/utils";
import { UserProfileData } from "@/types";

interface ProfileHeaderProps {
  profile: UserProfileData;
  currentUserId?: string | null;
}

export function ProfileHeader({ profile, currentUserId }: ProfileHeaderProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);
  const [hasPending, setHasPending] = useState(profile.hasPendingRequest);

  const isSelf = currentUserId === profile.id;

  const handleFollowChange = (isFollowing: boolean) => {
    setFollowerCount((prev) => (isFollowing ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-md">
          <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName} />
          <AvatarFallback className="text-2xl font-serif">{profile.displayName.slice(0, 2)}</AvatarFallback>
        </Avatar>

        {/* Profile Details */}
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {profile.displayName}
                </h1>
                {profile.writerType && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {profile.writerType}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">@{profile.username}</p>
            </div>

            {/* Profile CTA Actions */}
            <div className="flex items-center justify-center gap-2">
              {isSelf ? (
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <FollowButton
                    targetUserId={profile.id}
                    initialIsFollowing={profile.isFollowing || false}
                    currentUserId={currentUserId}
                    onFollowChange={handleFollowChange}
                  />

                  {profile.canMessage ? (
                    <Link href="/messages">
                      <Button size="sm" variant="outline" className="rounded-full text-xs font-semibold gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </Button>
                    </Link>
                  ) : hasPending ? (
                    <Button size="sm" variant="secondary" disabled className="rounded-full text-xs font-semibold gap-1.5 opacity-80">
                      <Check className="w-3.5 h-3.5" />
                      <span>Request Sent</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsRequestModalOpen(true)}
                      className="rounded-full text-xs font-semibold gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-foreground/90 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Genres / Tags */}
          {profile.genres && profile.genres.length > 0 && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {profile.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Social Stats & Meta */}
          <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-muted-foreground">
            <button
              onClick={() => setModalType("followers")}
              className="hover:text-foreground transition-colors"
            >
              <strong className="text-foreground font-semibold text-sm">{followerCount}</strong> Followers
            </button>
            <button
              onClick={() => setModalType("following")}
              className="hover:text-foreground transition-colors"
            >
              <strong className="text-foreground font-semibold text-sm">{profile.followingCount}</strong> Following
            </button>
            <span>
              <strong className="text-foreground font-semibold text-sm">{profile.writingsCount}</strong> Writings
            </span>

            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </span>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            )}

            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined {formatDate(profile.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MessageRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        receiver={{
          id: profile.id,
          displayName: profile.displayName,
          username: profile.username,
        }}
        onRequestSent={() => setHasPending(true)}
      />

      <FollowersModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        userId={profile.id}
        type={modalType || "followers"}
        title={modalType === "followers" ? "Followers" : "Following"}
      />
    </div>
  );
}
