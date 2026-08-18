import { SessionUser } from "@/types";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { MobileNav } from "./mobile-nav";

interface PlatformShellProps {
  user: SessionUser | null;
  children: React.ReactNode;
}

export function PlatformShell({ user, children }: PlatformShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar user={user} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Navbar user={user} />
        <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav user={user} />
    </div>
  );
}
