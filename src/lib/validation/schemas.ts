import { z } from "zod";

// Auth Schemas
export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(1, "Display name is required").max(50, "Display name too long"),
});

export const LoginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional().nullable(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable().or(z.literal("")),
  location: z.string().max(100).optional().nullable(),
  website: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  genres: z.array(z.string()).max(10).optional(),
  writerType: z.string().max(50).optional().nullable(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// Writing Schemas
export const WritingTypeEnum = z.enum([
  "POEM",
  "SHORT_STORY",
  "NOVEL",
  "CHAPTER",
  "ESSAY",
  "ARTICLE",
  "FLASH_FICTION",
  "SCREENPLAY",
  "JOURNAL",
  "OTHER",
]);

export const VisibilityEnum = z.enum(["PUBLIC", "PRIVATE"]);
export const WritingStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const CreateWritingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  content: z.string().min(1, "Content cannot be empty"),
  excerpt: z.string().max(500).optional().nullable(),
  writingType: WritingTypeEnum.default("SHORT_STORY"),
  visibility: VisibilityEnum.default("PUBLIC"),
  status: WritingStatusEnum.default("PUBLISHED"),
  coverImage: z.string().url("Invalid cover image URL").optional().nullable().or(z.literal("")),
  genreId: z.string().optional().nullable(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional().default([]),
});

export const UpdateWritingSchema = CreateWritingSchema.partial().extend({
  id: z.string().min(1, "Writing ID is required"),
});

// Social Schemas
export const FollowUserSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
});

export const FavouriteWritingSchema = z.object({
  writingId: z.string().min(1, "Writing ID is required"),
});

// Messaging Schemas
export const MessageRequestSchema = z.object({
  receiverId: z.string().min(1, "Recipient ID is required"),
  introNote: z.string().max(1000, "Note must be under 1000 characters").optional().nullable(),
});

export const RespondRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  action: z.enum(["ACCEPT", "DECLINE", "BLOCK"]),
});

export const SendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().min(1, "Message cannot be empty").max(4000, "Message too long"),
});

// Search Schema
export const SearchFilterSchema = z.object({
  q: z.string().optional().default(""),
  type: z.enum(["writings", "users", "all"]).optional().default("all"),
  writingType: WritingTypeEnum.optional(),
  genre: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  sortBy: z.enum(["relevance", "newest", "popular", "words"]).optional().default("relevance"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

// AI Studio Schemas
export const AIToolTypeEnum = z.enum([
  "IMPROVE",
  "REWRITE",
  "CONTINUE",
  "SUMMARIZE",
  "TITLE",
  "DESCRIPTION",
  "GRAMMAR",
  "TONE",
  "SHOW_DONT_TELL",
  "CHARACTER",
  "PLOT",
]);

export const RewriteToneEnum = z.enum([
  "Professional",
  "Casual",
  "Poetic",
  "Concise",
  "Descriptive",
  "Dramatic",
  "Simple",
]);

export const AIServiceSchema = z.object({
  tool: AIToolTypeEnum,
  text: z.string().min(1, "Input text is required").max(12000, "Input is too long (max 12,000 characters)"),
  tone: RewriteToneEnum.optional(),
  context: z.string().max(2000).optional(),
  genre: z.string().optional(),
});
