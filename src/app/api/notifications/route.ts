import { NextResponse } from "next/server";
import { NotificationService } from "@/services/notification.service";
import { requireUser } from "@/lib/auth/guards";

export async function GET() {
  try {
    const user = await requireUser();
    const [notifications, unreadCount] = await Promise.all([
      NotificationService.getUserNotifications(user.id),
      NotificationService.getUnreadCount(user.id),
    ]);

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 401 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // empty body means mark all as read
    }

    if (body.id) {
      await NotificationService.markAsRead(body.id, user.id);
    } else {
      await NotificationService.markAllAsRead(user.id);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { message: (err as Error).message } },
      { status: 400 }
    );
  }
}
