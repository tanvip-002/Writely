import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { SessionUser } from "@/types";

const JWT_SECRET = process.env.AUTH_SECRET || "writely-super-secret-jwt-signing-key-2026-production-ready";
const COOKIE_NAME = "writely_session";

export function signUserToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

export function verifyUserToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = signUserToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyUserToken(token);
  } catch {
    return null;
  }
}
