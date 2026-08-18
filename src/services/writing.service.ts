import { WritingRepository } from "@/repositories/writing.repository";
import { SocialRepository } from "@/repositories/social.repository";
import {
  calculateReadingTime,
  calculateWordCount,
  generateExcerpt,
  slugify,
} from "@/lib/utils";
import {
  canEditWriting,
  canDeleteWriting,
  canViewWriting,
  ForbiddenError,
  NotFoundError,
} from "@/lib/auth/guards";
import sanitizeHtml from "sanitize-html";
import { WritingType, Visibility, WritingStatus } from "@/types";

export class WritingService {
  static async getWritingBySlug(slug: string, currentUserId?: string | null) {
    const writing = await WritingRepository.findBySlug(slug);
    if (!writing) {
      throw new NotFoundError("Writing not found");
    }

    if (!canViewWriting(writing, currentUserId)) {
      throw new NotFoundError("Writing not found or private");
    }

    let isFavourited = false;
    if (currentUserId) {
      isFavourited = await SocialRepository.isFavourited(currentUserId, writing.id);
    }

    const moreFromAuthor = await WritingRepository.getMoreFromAuthor(
      writing.authorId,
      writing.id,
      3
    );

    return {
      ...writing,
      isFavourited,
      moreFromAuthor,
    };
  }

  static async getWritingById(id: string, currentUserId?: string | null) {
    const writing = await WritingRepository.findById(id);
    if (!writing) {
      throw new NotFoundError("Writing not found");
    }

    if (!canViewWriting(writing, currentUserId)) {
      throw new NotFoundError("Writing not found or private");
    }

    return writing;
  }

  static async createWriting(
    authorId: string,
    data: {
      title: string;
      content: string;
      excerpt?: string | null;
      writingType: WritingType;
      visibility: Visibility;
      status: WritingStatus;
      coverImage?: string | null;
      genreId?: string | null;
      tags?: string[];
    }
  ) {
    const cleanContent = sanitizeHtml(data.content, {
      allowedTags: [
        "h1", "h2", "h3", "h4", "p", "b", "i", "em", "strong", "a",
        "blockquote", "ul", "ol", "li", "code", "pre", "hr", "br", "u", "s"
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
      },
    });

    const slug = slugify(data.title);
    const wordCount = calculateWordCount(cleanContent);
    const readingTime = calculateReadingTime(cleanContent);
    const excerpt = data.excerpt || generateExcerpt(cleanContent);

    return WritingRepository.create({
      title: data.title.trim(),
      slug,
      content: cleanContent,
      excerpt,
      writingType: data.writingType,
      visibility: data.visibility,
      status: data.status,
      coverImage: data.coverImage,
      genreId: data.genreId,
      tags: data.tags,
      wordCount,
      readingTime,
      authorId,
    });
  }

  static async updateWriting(
    writingId: string,
    currentUserId: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string | null;
      writingType?: WritingType;
      visibility?: Visibility;
      status?: WritingStatus;
      coverImage?: string | null;
      genreId?: string | null;
      tags?: string[];
    }
  ) {
    const writing = await WritingRepository.findById(writingId);
    if (!writing) throw new NotFoundError("Writing not found");

    if (!canEditWriting(writing.authorId, currentUserId)) {
      throw new ForbiddenError("You are not allowed to edit this writing");
    }

    let cleanContent = data.content;
    let wordCount = writing.wordCount;
    let readingTime = writing.readingTime;
    let excerpt = data.excerpt !== undefined ? data.excerpt : writing.excerpt;

    if (data.content !== undefined) {
      cleanContent = sanitizeHtml(data.content, {
        allowedTags: [
          "h1", "h2", "h3", "h4", "p", "b", "i", "em", "strong", "a",
          "blockquote", "ul", "ol", "li", "code", "pre", "hr", "br", "u", "s"
        ],
        allowedAttributes: {
          a: ["href", "target", "rel"],
        },
      });
      wordCount = calculateWordCount(cleanContent);
      readingTime = calculateReadingTime(cleanContent);
      if (!data.excerpt) {
        excerpt = generateExcerpt(cleanContent);
      }
    }

    return WritingRepository.update(writingId, {
      title: data.title?.trim(),
      content: cleanContent,
      excerpt,
      writingType: data.writingType,
      visibility: data.visibility,
      status: data.status,
      coverImage: data.coverImage,
      genreId: data.genreId,
      tags: data.tags,
      wordCount,
      readingTime,
    });
  }

  static async deleteWriting(writingId: string, currentUserId: string) {
    const writing = await WritingRepository.findById(writingId);
    if (!writing) throw new NotFoundError("Writing not found");

    if (!canDeleteWriting(writing.authorId, currentUserId)) {
      throw new ForbiddenError("You are not allowed to delete this writing");
    }

    return WritingRepository.delete(writingId);
  }

  static async getFeed(params: {
    type?: "all" | "following" | "popular" | "recent";
    userId?: string | null;
    cursor?: string;
    limit?: number;
  }) {
    return WritingRepository.getFeed(params);
  }

  static async getUserWritings(params: {
    authorId: string;
    currentUserId?: string | null;
    status?: WritingStatus;
    visibility?: Visibility;
    writingType?: WritingType;
    page?: number;
    limit?: number;
  }) {
    return WritingRepository.getUserWritings(params);
  }
}
