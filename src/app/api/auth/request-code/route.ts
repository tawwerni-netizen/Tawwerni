import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestOtp, OtpRateLimited } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { otpEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "إيميل غير صالح" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: { email: normalizedEmail },
  });

  let code: string;
  try {
    code = await requestOtp(normalizedEmail);
  } catch (err) {
    if (err instanceof OtpRateLimited) {
      return NextResponse.json(
        { error: "طلبت أكواد كتير. استنى شوية وجرّب تاني." },
        { status: 429 }
      );
    }
    throw err;
  }

  const tpl = otpEmail(code);
  const sent = await sendEmail({
    to: normalizedEmail,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  // Until email delivery is configured, keep showing the code on screen so
  // sign-in still works. Once it is, the code must never leave the inbox.
  const emailWorks = sent.ok && sent.delivered;

  return NextResponse.json({
    ok: true,
    emailSent: emailWorks,
    ...(emailWorks ? {} : { devCode: code }),
  });
}
