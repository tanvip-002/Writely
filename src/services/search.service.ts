import { WritingRepository } from "@/repositories/writing.repository";
import { UserRepository } from "@/repositories/user.repository";
import { WritingType } from "@/types";

export class SearchService {
  static async search({
    query = "",
    type = "all",
    writingType,
    genre,
    tag,
    author,
    sortBy = "relevance",
    page = 1,
    limit = 12,
  }: {
    query?: string;
    type?: "writings" | "users" | "all";
    writingType?: WritingType;
    genre?: string;
    tag?: string;
    author?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    let writingsResult = {
      items: [] as unknown[],
      total: 0,
      page: 1,
      totalPages: 0,
    };
    let usersResult: unknown[] = [];

    if (type === "all" || type === "writings") {
      writingsResult = await WritingRepository.search({
        query,
        writingType,
        genre,
        tag,
        author,
        sortBy,
        page,
        limit,
      });
    }

    if ((type === "all" || type === "users") && query.trim()) {
      usersResult = await UserRepository.searchUsers(query.trim(), 8);
    }

    return {
      writings: writingsResult.items,
      writingsTotal: writingsResult.total,
      writingsPage: writingsResult.page,
      writingsTotalPages: writingsResult.totalPages,
      users: usersResult,
    };
  }
}
