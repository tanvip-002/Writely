import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { WritingService } from "@/services/writing.service";
import { ReaderView } from "@/components/writing/reader-view";
import { Metadata } from "next";

interface ReaderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ReaderPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const writing = await WritingService.getWritingBySlug(slug);
    if (!writing || writing.visibility !== "PUBLIC" || writing.status !== "PUBLISHED") {
      return { title: "Writing Not Found — Writely" };
    }

    return {
      title: `${writing.title} by ${writing.author.displayName} — Writely`,
      description: writing.excerpt || `Read "${writing.title}" on Writely.`,
      openGraph: {
        title: `${writing.title} by ${writing.author.displayName}`,
        description: writing.excerpt || `Read "${writing.title}" on Writely.`,
        type: "article",
        publishedTime: writing.publishedAt?.toISOString() || writing.createdAt.toISOString(),
        authors: [writing.author.displayName],
      },
    };
  } catch {
    return { title: "Writing Not Found — Writely" };
  }
}

export default async function WritingReaderPage({ params }: ReaderPageProps) {
  const { slug } = await params;
  const user = await getSessionUser();

  try {
    const writing = await WritingService.getWritingBySlug(slug, user?.id);
    return <ReaderView writing={writing as any} currentUserId={user?.id} />;
  } catch {
    notFound();
  }
}
