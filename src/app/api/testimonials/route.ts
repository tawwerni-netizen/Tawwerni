import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/** Below this, an opinion is a first impression, not a testimonial. */
const MIN_COMPLETIONS = 3;

/**
 * A learner submitting their own testimonial, in their own words.
 *
 * Goes to `pending` — nothing here is ever shown publicly on its own say-so.
 * Gated on real engagement (see `MIN_COMPLETIONS`) rather than open to anyone
 * who signs up, and capped at one per account so the review queue is real
 * opinions, not a way to promote the same account's message repeatedly.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "لازم تسجّل دخول الأول" }, { status: 401 });

  const { quote, rating, courseId } = await readJson(request);

  const trimmed = typeof quote === "string" ? quote.trim() : "";
  if (trimmed.length < 10 || trimmed.length > 800) {
    return NextResponse.json({ error: "اكتب كلامك بين 10 و800 حرف" }, { status: 400 });
  }

  const ratingNum = rating === undefined || rating === null ? null : Number(rating);
  if (ratingNum !== null && (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5)) {
    return NextResponse.json({ error: "التقييم لازم يكون من 1 لـ5" }, { status: 400 });
  }

  const completionCount = await prisma.lessonCompletion.count({ where: { userId: user.id } });
  if (completionCount < MIN_COMPLETIONS) {
    return NextResponse.json(
      { error: `كمّل ${MIN_COMPLETIONS} دروس على الأقل الأول عشان تقدر تشارك تجربتك` },
      { status: 403 }
    );
  }

  const existing = await prisma.testimonial.findFirst({ where: { userId: user.id } });
  if (existing) {
    return NextResponse.json({ error: "بعتّ رأيك قبل كده — شكرًا 🙏" }, { status: 409 });
  }

  let validCourseId: string | null = null;
  if (typeof courseId === "string" && courseId) {
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
    if (course) validCourseId = course.id;
  }

  await prisma.testimonial.create({
    data: {
      userId: user.id,
      courseId: validCourseId,
      holderName: user.name ?? user.email.split("@")[0],
      avatarUrl: user.avatarUrl,
      rating: ratingNum,
      quote: trimmed,
    },
  });

  return NextResponse.json({
    ok: true,
    note: "شكرًا على رأيك! هنراجعه ونعرضه على الموقع لو مناسب.",
  });
}
