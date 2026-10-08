import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { maybeSendWelcome } from "@/lib/welcome";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";
import { createSessionCookie } from "@/lib/auth";
import { hashPassword, passwordProblem, isValidPassword } from "@/lib/password";
import { attachReferrer } from "@/lib/referrals";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";
import { ensureDatabaseSchema } from "@/lib/db-schema-sync";

export async function POST(request: Request) {
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`signup:${clientIp(request)}`, 8, 3600);
  if (!gate.ok) return tooMany(gate, "عملت حسابات كتير من الجهاز ده. استنى شوية.");

  const { email, password, name, phone } = await readJson(request);

  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!normalizedEmail.includes("@") || normalizedEmail.length < 5) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }

  const pwProblem = passwordProblem(password);
  if (pwProblem || !isValidPassword(password)) {
    return NextResponse.json({ error: pwProblem ?? "باسورد غير صالح" }, { status: 400 });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "اكتب اسمك" }, { status: 400 });
  }

  try {
    await ensureDatabaseSchema(prisma).catch(() => {});

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, passwordHash: true },
    });

    // An account can already exist without a password: the person bought first
    // and is only now setting one up. That path completes the account instead
    // of refusing it.
    if (existing?.passwordHash) {
      return NextResponse.json(
        { error: "فيه حساب بالإيميل ده بالفعل. سجّل دخول." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const normalizedPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: name.trim(),
            ...(normalizedPhone ? { phone: normalizedPhone } : {}),
            mustChangePassword: false,
          },
          select: { id: true, email: true, dailyPaceMinutes: true },
        })
      : await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            name: name.trim(),
            ...(normalizedPhone ? { phone: normalizedPhone } : {}),
          },
          select: { id: true, email: true, dailyPaceMinutes: true },
        });

    const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
    if (refCode) {
      await attachReferrer(user.id, refCode).catch(() => {});
    }

    await maybeSendWelcome(user.id).catch(() => {});

    await createSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      hasOnboarded: user.dailyPaceMinutes != null,
    });
  } catch (err: any) {
    console.error("[Signup Route Error]:", err?.message || err);
    return NextResponse.json(
      { error: "حصل خطأ في السيرفر أثناء إنشاء الحساب. جرّب تاني بعد شوية." },
      { status: 500 }
    );
  }
}
