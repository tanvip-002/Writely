import { NextResponse } from "next/server";
import { SearchService } from "@/services/search.service";
import { SearchFilterSchema } from "@/lib/validation/schemas";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = SearchFilterSchema.parse({
      q: searchParams.get("q") || undefined,
      type: searchParams.get("type") || undefined,
      writingType: searchParams.get("writingType") || undefined,
      genre: searchParams.get("genre") || undefined,
      tag: searchParams.get("tag") || undefined,
      author: searchParams.get("author") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    const results = await SearchService.search({
      query: parsed.q,
      type: parsed.type,
      writingType: parsed.writingType,
      genre: parsed.genre,
      tag: parsed.tag,
      author: parsed.author,
      sortBy: parsed.sortBy,
      page: parsed.page,
      limit: parsed.limit,
    });

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 400 }
    );
  }
}
