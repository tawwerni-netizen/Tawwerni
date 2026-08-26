import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { askCoach, MissingApiKeyError } from "@/lib/anthropic";
import { computeLevel, computeStreak } from "@/lib/xp";
import { rateLimit, tooMany } from "@/lib/rate-limit";

/** A question, not a document. Also caps what one call can cost. */
const MAX_MESSAGE_CHARS = 2000;

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "لازم تسجل دخول" }, { status: 401 });

  // Every call here costs real money at the model provider, so it is capped
  // per account rather than per IP — the session is the thing being billed.
  const gate = rateLimit(`chat:${userId}`, 30, 3600);
  if (!gate.ok) return tooMany(gate, "أسئلة كتير في وقت قصير. استنى شوية.");

  const { message } = await request.json();
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "اكتب رسالة الأول" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: "الرسالة طويلة أوي. اختصرها شوية." }, { status: 413 });
  }

  const [user, completions, history] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.lessonCompletion.findMany({
      where: { userId },
      include: { lesson: { include: { module: { include: { course: true } } } } },
      orderBy: { completedAt: "desc" },
    }),
    prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 20 }),
  ]);

  const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const level = computeLevel(totalXp);
  const latest = completions[0];

  await prisma.chatMessage.create({ data: { userId, role: "user", content: message } });

  try {
    const reply = await askCoach(
      [...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user", content: message }],
      {
        name: user?.name ?? null,
        totalXp,
        streak,
        levelName: level.name,
        archetype: user?.archetype ?? null,
        currentCourseTitle: latest?.lesson.module.course.title ?? null,
        currentDay: latest?.lesson.dayNumber ?? null,
      }
    );

    await prisma.chatMessage.create({ data: { userId, role: "assistant", content: reply } });
    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      const fallback =
        "لسه محتاج مفتاح Anthropic API عشان أقدر أرد عليك فعليًا. اطلب من صاحب الموقع يضيفه في إعدادات المشروع.";
      return NextResponse.json({ reply: fallback });
    }
    console.error(err);
    return NextResponse.json({ error: "حصل خطأ، جرب تاني" }, { status: 500 });
  }
}
