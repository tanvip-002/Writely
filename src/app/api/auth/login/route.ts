import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { LoginSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = LoginSchema.parse(body);

    const user = await AuthService.login(validated);

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "LOGIN_FAILED",
          message: (err as Error).message || "Invalid credentials",
        },
      },
      { status: 401 }
    );
  }
}
