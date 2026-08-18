import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { RegisterSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    const user = await AuthService.register(validated);

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REGISTRATION_FAILED",
          message: (err as Error).message || "Failed to register account",
        },
      },
      { status: 400 }
    );
  }
}
