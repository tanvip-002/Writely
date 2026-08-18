import { redirect, notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { WritingRepository } from "@/repositories/writing.repository";
import { prisma } from "@/lib/db/prisma";
import { EditWritingForm } from "./edit-writing-form";

interface EditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditWritingPage({ params }: EditPageProps) {
  const { slug } = await params;
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const writing = await WritingRepository.findBySlug(slug);
  if (!writing) {
    notFound();
  }

  // Strictly verify author permission
  if (writing.authorId !== user.id) {
    redirect("/dashboard");
  }

  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Edit Writing
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Update your text, revise formatting, change visibility, or publish changes.
        </p>
      </div>

      <EditWritingForm
        writing={{
          id: writing.id,
          title: writing.title,
          slug: writing.slug,
          content: writing.content,
          writingType: writing.writingType as any,
          genreId: writing.genreId || "NONE",
          visibility: writing.visibility as any,
          status: writing.status as any,
          tags: writing.tags.map((t) => t.tag.name),
        }}
        genres={genres}
      />
    </div>
  );
}
