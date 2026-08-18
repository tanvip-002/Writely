"use client";

import { useEffect, useState, useCallback } from "react";
import { SessionUser } from "@/types";

export function useCurrentUser() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const json = await res.json();
      setUser(json.data?.user ?? null);
    } catch (err) {
      setError((err as Error).message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refresh: fetchUser };
}
