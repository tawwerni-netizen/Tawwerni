import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { hashPassword, passwordProblem } from "@/lib/password";
import { attachReferrer } from "@/lib/referrals";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  const { email, password, name, phone } = await request.json();

  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!normalizedEmail.includes("@") || normalizedEmail.length < 5) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }

  const pwProblem = passwordProblem(password);
  if (pwProblem) return NextResponse.json({ error: pwProblem }, { status: 400 });

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "اكتب اسمك" }, { status: 400 });
  }

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
      })
    : await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name: name.trim(),
          ...(normalizedPhone ? { phone: normalizedPhone } : {}),
        },
      });

  const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
  await attachReferrer(user.id, refCode).catch(() => {});

  if (!user.welcomedAt) {
    const tpl = welcomeEmail({ name: user.name });
    const sent = await sendEmail({
      to: normalizedEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    if (sent.ok && sent.delivered) {
      await prisma.user.update({ where: { id: user.id }, data: { welcomedAt: new Date() } });
    }
  }

  await createSessionCookie(user.id);

  return NextResponse.json({
    ok: true,
    hasOnboarded: user.dailyPaceMinutes != null,
  });
}
