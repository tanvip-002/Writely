"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, MessageSquare, PenTool, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";

interface MobileNavProps {
  user: SessionUser | null;
  unreadMessages?: number;
}

export function MobileNav({ user, unreadMessages = 0 }: MobileNavProps) {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Create", href: "/create", icon: PenTool, highlight: true },
    { label: "AI", href: "/ai", icon: Sparkles },
    {
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      label: "Profile",
      href: user ? `/u/${user.username}` : "/login",
      icon: User,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/60 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-medium transition-colors",
                isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground",
                item.highlight && "text-primary"
              )}
            >
              <div className={cn(
                "p-1 rounded-full",
                item.highlight && "bg-primary/10"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
