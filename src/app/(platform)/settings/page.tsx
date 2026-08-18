import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserRepository } from "@/repositories/user.repository";
import { prisma } from "@/lib/db/prisma";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const fullUser = await UserRepository.findById(user.id);
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  if (!fullUser) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Account & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Customize your author bio, genre interests, and security preferences.
        </p>
      </div>

      <SettingsForm
        initialUser={{
          displayName: fullUser.displayName,
          username: fullUser.username,
          email: fullUser.email,
          bio: fullUser.bio || "",
          location: fullUser.location || "",
          website: fullUser.website || "",
          writerType: fullUser.writerType || "",
          genres: fullUser.genres ? fullUser.genres.split(",").map((g) => g.trim()).filter(Boolean) : [],
        }}
        availableGenres={genres}
      />
    </div>
  );
}
