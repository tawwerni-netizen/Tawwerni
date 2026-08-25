import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeArchetype, computeReadinessScore } from "@/content/marketing-quiz";

export async function POST(request: Request) {
  const { email, name, answers } = await request.json();
  if (typeof email !== "string" || !email.includes("@") || typeof answers !== "object") {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const archetype = computeArchetype(answers);
  const score = computeReadinessScore(answers);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      name: typeof name === "string" && name.trim() ? name.trim() : undefined,
      quizAnswers: JSON.stringify(answers),
      aiReadinessScore: score,
      archetype: archetype.title,
      focusCategory: typeof answers.field === "string" ? answers.field : undefined,
    },
    create: {
      email: normalizedEmail,
      name: typeof name === "string" ? name.trim() : null,
      quizAnswers: JSON.stringify(answers),
      aiReadinessScore: score,
      archetype: archetype.title,
      focusCategory: typeof answers.field === "string" ? answers.field : null,
    },
  });

  return NextResponse.json({ ok: true, userId: user.id, archetype, score });
}
