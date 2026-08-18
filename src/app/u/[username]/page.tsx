import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserService } from "@/services/user.service";
import { WritingRepository } from "@/repositories/writing.repository";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileWritings } from "./profile-writings";
import { Metadata } from "next";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await UserService.getProfileByUsername(username);
  if (!profile) return { title: "User Not Found — Writely" };

  return {
    title: `${profile.displayName} (@${profile.username}) — Writely`,
    description: profile.bio || `Read stories and poetry by ${profile.displayName} on Writely.`,
    openGraph: {
      title: `${profile.displayName} (@${profile.username}) — Writely`,
      description: profile.bio || `Read stories and poetry by ${profile.displayName} on Writely.`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const currentUser = await getSessionUser();

  const profile = await UserService.getProfileByUsername(username, currentUser?.id);
  if (!profile) {
    notFound();
  }

  const writingsResult = await WritingRepository.getUserWritings({
    authorId: profile.id,
    currentUserId: currentUser?.id,
    limit: 50,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <ProfileHeader profile={profile} currentUserId={currentUser?.id} />

      <ProfileWritings
        initialWritings={writingsResult.items as any}
        authorName={profile.displayName}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
