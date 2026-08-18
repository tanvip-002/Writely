import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { CreateWritingForm } from "./create-writing-form";

export default async function CreatePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Create New Writing
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Compose your piece, apply formatting, and publish to the world or keep it strictly private.
        </p>
      </div>

      <CreateWritingForm genres={genres} />
    </div>
  );
}
