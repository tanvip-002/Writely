import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { requireUser } from "@/lib/auth/guards";
import { UpdateProfileSchema } from "@/lib/validation/schemas";

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const validated = UpdateProfileSchema.parse(body);

    const updated = await UserService.updateProfile(user.id, validated);

    return NextResponse.json({
      success: true,
      data: { user: updated },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 400 }
    );
  }
}
