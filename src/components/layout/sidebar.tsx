"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Feather,
  Heart,
  Home,
  LogOut,
  MessageSquare,
  PenTool,
  Settings,
  Sparkles,
  User,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  user: SessionUser | null;
  unreadNotifications?: number;
  unreadMessages?: number;
}

export function Sidebar({ user, unreadNotifications = 0, unreadMessages = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      // ignore
    }
  };

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Create", href: "/create", icon: PenTool, highlight: true },
    { label: "AI Studio", href: "/ai", icon: Sparkles },
    { label: "Favourites", href: "/favourites", icon: Heart },
    {
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      label: "My Writings",
      href: "/writings",
      icon: BookOpen,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 border-r border-border/50 bg-card/40 backdrop-blur-xs px-4 py-6 z-30">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-1 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Writely
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
              Writers Network
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                  item.highlight && !isActive && "text-primary hover:text-primary font-semibold"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                      item.highlight && !isActive && "text-primary"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Settings Section */}
      <div className="pt-4 border-t border-border/50 space-y-1">
        {user ? (
          <>
            <Link
              href={`/u/${user.username}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted/70",
                pathname.startsWith(`/u/${user.username}`) && "bg-muted font-medium text-foreground"
              )}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
                <AvatarFallback>{user.displayName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground truncate">
                  {user.displayName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  @{user.username}
                </span>
              </div>
            </Link>

            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/70",
                pathname === "/settings" && "bg-muted font-medium text-foreground"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <div className="p-2 space-y-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
