export type WritingType =
  | "POEM"
  | "SHORT_STORY"
  | "NOVEL"
  | "CHAPTER"
  | "ESSAY"
  | "ARTICLE"
  | "FLASH_FICTION"
  | "SCREENPLAY"
  | "JOURNAL"
  | "OTHER";

export type Visibility = "PUBLIC" | "PRIVATE";

export type WritingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

export type NotificationType =
  | "FOLLOW"
  | "FAVOURITE"
  | "MESSAGE_REQUEST"
  | "MESSAGE_ACCEPTED"
  | "SYSTEM";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface WritingWithAuthor {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  writingType: WritingType;
  visibility: Visibility;
  status: WritingStatus;
  coverImage: string | null;
  wordCount: number;
  readingTime: number;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  };
  genreId: string | null;
  genre?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
  _count?: {
    favourites: number;
  };
  isFavourited?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string | null;
}

export interface UserProfileData {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  website: string | null;
  genres: string[];
  writerType: string | null;
  createdAt: Date | string;
  followerCount: number;
  followingCount: number;
  writingsCount: number;
  isFollowing?: boolean;
  hasPendingRequest?: boolean;
  canMessage?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AIOperationResult {
  tool: string;
  originalText?: string;
  output: string;
  metadata?: Record<string, unknown>;
}
