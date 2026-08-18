import { getSessionUser } from "@/lib/auth/session";
import { PlatformShell } from "@/components/layout/platform-shell";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return <PlatformShell user={user}>{children}</PlatformShell>;
}
