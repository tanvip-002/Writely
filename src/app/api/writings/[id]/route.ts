import { NextResponse } from "next/server";
import { WritingService } from "@/services/writing.service";
import { requireUser } from "@/lib/auth/guards";
import { getSessionUser } from "@/lib/auth/session";
import { CreateWritingSchema } from "@/lib/validation/schemas";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const writing = await WritingService.getWritingById(id, user?.id);

    return NextResponse.json({
      success: true,
      data: { writing },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: (err as Error).message },
      },
      { status: 404 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const body = await req.json();
    const validated = CreateWritingSchema.partial().parse(body);

    const updated = await WritingService.updateWriting(id, user.id, validated);

    return NextResponse.json({
      success: true,
      data: { writing: updated },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UPDATE_WRITING_ERROR", message: (err as Error).message },
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await WritingService.deleteWriting(id, user.id);

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "DELETE_WRITING_ERROR", message: (err as Error).message },
      },
      { status: 403 }
    );
  }
}
