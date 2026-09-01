import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";

const KNOWN_MAGNETS = ["ai-prompts"];

/**
 * Trades an email for something real and immediate.
 *
 * Unauthenticated, like the quiz lead route — this runs before anyone has an
 * account. Kept deliberately separate from `User`: this isn't a quiz answer
 * set, and the same address can request more than one magnet over time
 * without any account-merging logic to get wrong.
 */
export async function POST(request: Request) {
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`lead-magnet:${clientIp(request)}`, 20, 3600);
  if (!gate.ok) return tooMany(gate, "محاولات كتير. استنى شوية وجرّب تاني.");

  const { email, name, magnetKey } = await readJson(request);

  if (typeof email !== "string" || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }
  if (typeof magnetKey !== "string" || !KNOWN_MAGNETS.includes(magnetKey)) {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  await prisma.leadMagnetRequest.create({
    data: {
      email: email.toLowerCase().trim(),
      name: typeof name === "string" && name.trim() ? name.trim().slice(0, 60) : null,
      magnetKey,
    },
  });

  return NextResponse.json({ ok: true });
}
