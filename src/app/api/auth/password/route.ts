import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { requireUser } from "@/lib/auth/guards";
import { ChangePasswordSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { currentPassword, newPassword } = ChangePasswordSchema.parse(body);

    await AuthService.changePassword(user.id, currentPassword, newPassword);

    return NextResponse.json({
      success: true,
      data: { message: "Password updated successfully" },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 400 }
    );
  }
}
