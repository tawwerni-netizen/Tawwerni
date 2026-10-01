import { NextResponse } from "next/server";
import { adminUser } from "@/lib/admin";
import { backfillUserCourseProgress } from "@/lib/user-progress-backfill";
import { readJson } from "@/lib/read-json";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { userId } = await params;
  const body = await readJson(request);

  const courseSlug = (body.courseSlug as string) || "tahaddi-28-yawm";
  const completedDayCount = Number(body.completedDayCount || body.dayNumber || 18);

  const result = await backfillUserCourseProgress(userId, courseSlug, completedDayCount);

  if (!result || !result.success) {
    return NextResponse.json(
      { error: result?.error || "فشل تحديث التقدم" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `تم تحديث تقدم المستخدم إلى ${completedDayCount} درس بنجاح في ${courseSlug}`,
    result,
  });
}
