import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { WritingRepository } from "@/repositories/writing.repository";
import { MyWritingsView } from "./my-writings-view";
import Link from "next/link";
import { PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MyWritingsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const result = await WritingRepository.getUserWritings({
    authorId: user.id,
    currentUserId: user.id,
    limit: 50,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            My Writings Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your published stories, works in progress, drafts, and private journals.
          </p>
        </div>

        <Link href="/create">
          <Button className="rounded-full gap-2 font-semibold shadow-xs">
            <PenTool className="w-3.5 h-3.5" />
            <span>Create New Piece</span>
          </Button>
        </Link>
      </div>

      <MyWritingsView initialItems={result.items as any} authorId={user.id} />
    </div>
  );
}
