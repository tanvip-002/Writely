import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { SocialService } from "@/services/social.service";
import { prisma } from "@/lib/db/prisma";
import { FavouritesView } from "./favourites-view";

export default async function FavouritesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const [favResult, genres] = await Promise.all([
    SocialService.getUserFavourites({
      userId: user.id,
      limit: 50,
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          My Favourites
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Stories, poems, and essays you have saved to revisit and admire.
        </p>
      </div>

      <FavouritesView
        initialItems={favResult.items as any}
        genres={genres}
        currentUserId={user.id}
      />
    </div>
  );
}
