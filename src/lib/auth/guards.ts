import { getSessionUser } from "./session";
import { SessionUser, Visibility, WritingStatus } from "@/types";

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to access this resource") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new UnauthorizedError("You must be logged in to perform this action.");
  }
  return user;
}

export function canEditWriting(authorId: string, currentUserId: string | null | undefined): boolean {
  if (!currentUserId) return false;
  return authorId === currentUserId;
}

export function canDeleteWriting(authorId: string, currentUserId: string | null | undefined): boolean {
  if (!currentUserId) return false;
  return authorId === currentUserId;
}

export function canViewWriting(
  writing: {
    authorId: string;
    visibility: Visibility | string;
    status: WritingStatus | string;
  },
  currentUserId: string | null | undefined
): boolean {
  // If the user is the author, they can always view it
  if (currentUserId && writing.authorId === currentUserId) {
    return true;
  }

  // If writing is private, draft, or archived, only the author can view it
  if (writing.visibility === "PRIVATE" || writing.status === "DRAFT" || writing.status === "ARCHIVED") {
    return false;
  }

  // Public & Published writings are viewable by anyone
  return writing.visibility === "PUBLIC" && writing.status === "PUBLISHED";
}
