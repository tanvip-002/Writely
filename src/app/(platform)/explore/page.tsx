import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { SearchView } from "@/components/search/search-view";

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    genre?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const user = await getSessionUser();

  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <SearchView
      initialQuery={params.q || ""}
      initialTag={params.tag || ""}
      initialGenre={params.genre || ""}
      genres={genres}
      currentUserId={user?.id}
    />
  );
}
