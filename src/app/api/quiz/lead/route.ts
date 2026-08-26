import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { computeArchetype, computeReadinessScore } from "@/content/marketing-quiz";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";

/**
 * Captures a marketing-quiz lead.
 *
 * Unauthenticated by necessity — the whole point is that this runs before
 * anyone has an account. That makes it the one endpoint where a stranger can
 * name an email address and have something written against it, so what it is
 * allowed to write is deliberately narrow:
 *
 *  - A brand-new address creates a lead record.
 *  - An address that already belongs to a *real account* (it has a password)
 *    is left completely alone. Otherwise anyone could POST a paying customer's
 *    address and overwrite their name and preferences from the open internet.
 */
export async function POST(request: Request) {
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`lead:${clientIp(request)}`, 15, 3600);
  if (!gate.ok) return tooMany(gate, "محاولات كتير. استنى شوية وجرّب تاني.");

  const { email, name, answers: rawAnswers } = await readJson(request);
  if (
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof rawAnswers !== "object" ||
    rawAnswers === null ||
    Array.isArray(rawAnswers)
  ) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  /*
   * Keep only string values, and cap them.
   *
   * The quiz answers arrive from the browser and are stored as JSON, so
   * without this a caller could post arbitrarily deep objects or megabytes of
   * text into the row. The scoring functions only ever read strings anyway.
   */
  const answers: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawAnswers as Record<string, unknown>)) {
    if (typeof value === "string" && key.length <= 40) {
      answers[key.slice(0, 40)] = value.slice(0, 200);
    }
  }

  const normalizedEmail = email.toLowerCase().trim();
  const archetype = computeArchetype(answers);
  const score = computeReadinessScore(answers);
  const cleanName = typeof name === "string" && name.trim() ? name.trim().slice(0, 60) : null;

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, passwordHash: true },
  });

  if (existing) {
    // A real account: quietly accept and change nothing. Answering the same
    // way as for a new address keeps this from reporting who has an account.
    if (existing.passwordHash) {
      return NextResponse.json({ ok: true, userId: existing.id, archetype, score });
    }

    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        ...(cleanName ? { name: cleanName } : {}),
        quizAnswers: JSON.stringify(answers),
        aiReadinessScore: score,
        archetype: archetype.title,
        ...(typeof answers.field === "string" ? { focusCategory: answers.field } : {}),
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, userId: updated.id, archetype, score });
  }

  const created = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: cleanName,
      quizAnswers: JSON.stringify(answers),
      aiReadinessScore: score,
      archetype: archetype.title,
      focusCategory: typeof answers.field === "string" ? answers.field : null,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, userId: created.id, archetype, score });
}
