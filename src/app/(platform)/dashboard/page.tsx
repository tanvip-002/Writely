import { getSessionUser } from "@/lib/auth/session";
import { WritingService } from "@/services/writing.service";
import { UserService } from "@/services/user.service";
import { FeedContainer } from "./feed-container";
import Link from "next/link";
import { PenTool, Sparkles, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getSessionUser();

  const [initialFeed, featuredWriters] = await Promise.all([
    WritingService.getFeed({
      type: "all",
      userId: user?.id,
      limit: 10,
    }),
    UserService.getFeaturedWriters(5),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Feed Column (2 cols on lg) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome & Quick Write Banner */}
        <div className="p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-card space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {user ? `Welcome back, ${user.displayName}.` : "Welcome to Writely."}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Discover the latest written works from the global literary community.
              </p>
            </div>

            <Link href="/create">
              <Button className="rounded-full gap-2 font-semibold shadow-xs shrink-0">
                <PenTool className="w-3.5 h-3.5" />
                <span>Write Story</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Interactive Feed */}
        <FeedContainer
          initialItems={initialFeed.items as any}
          initialNextCursor={initialFeed.nextCursor}
          currentUserId={user?.id}
        />
      </div>

      {/* Right Sidebar: Featured Writers & Quick Studio Promo */}
      <div className="space-y-6 hidden lg:block sticky top-24">
        {/* AI Studio Promo Card */}
        <div className="p-5 rounded-2xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-serif font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>AI Writing Studio</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enhance cadence, rewrite with vivid literary styles, or brainstorm character arcs in our non-destructive studio.
          </p>
          <Link href="/ai" className="block">
            <Button size="sm" variant="outline" className="w-full text-xs font-semibold rounded-lg bg-background">
              Open AI Studio
            </Button>
          </Link>
        </div>

        {/* Featured Writers */}
        <div className="p-5 rounded-2xl border border-border/60 bg-card space-y-4 shadow-xs">
          <h2 className="font-serif font-bold text-base text-foreground">
            Writers to Follow
          </h2>

          <div className="space-y-3">
            {featuredWriters.map((writer) => (
              <div
                key={writer.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <Link
                  href={`/u/${writer.username}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1 group"
                >
                  <Avatar className="w-9 h-9 border border-border/50">
                    <AvatarImage src={writer.avatarUrl || undefined} alt={writer.displayName} />
                    <AvatarFallback>{writer.displayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                      {writer.displayName}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      @{writer.username}
                    </span>
                  </div>
                </Link>

                <Link href={`/u/${writer.username}`}>
                  <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
