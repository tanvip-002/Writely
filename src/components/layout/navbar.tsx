"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Feather, Search, Sparkles, PenTool, User, LogOut, Settings } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SessionUser } from "@/types";
import { NotificationBell } from "./notification-bell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: SessionUser | null;
}

export function Navbar({ user: serverUser }: NavbarProps) {
  const { user: clientUser, loading } = useCurrentUser();
  const user = serverUser === undefined ? clientUser : serverUser;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      {/* Mobile Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Feather className="w-4 h-4" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">Writely</span>
        </Link>
      </div>

      {/* Global Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search writings, authors, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-xs sm:text-sm rounded-full bg-muted/60 border border-transparent focus:border-border focus:bg-background focus:outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
      </form>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/explore" className="sm:hidden p-2 text-muted-foreground hover:text-foreground">
          <Search className="w-5 h-5" />
        </Link>

        <Link href="/ai">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex items-center gap-1.5 rounded-full text-xs font-semibold border-amber-300/40 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 hover:bg-amber-100/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>AI Studio</span>
          </Button>
        </Link>

        <Link href="/create">
          <Button size="sm" className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold shadow-xs">
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Write</span>
          </Button>
        </Link>

        {!loading && user && <NotificationBell />}

                {!loading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 ml-1">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/u/${user.username}`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/writings" className="cursor-pointer">
                  <Feather className="mr-2 h-4 w-4" />
                  <span>My Writings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted/50 animate-pulse" />
                <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="text-xs">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
