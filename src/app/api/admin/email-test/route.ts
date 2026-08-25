import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { sendEmail, emailStatus } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

/** Sends a real welcome email to an address of the operator's choosing. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { to } = await request.json();
  if (typeof to !== "string" || !to.includes("@")) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }

  const status = emailStatus();
  if (!status.configured) {
    return NextResponse.json(
      { error: "الإيميل مش متظبط. حط SMTP_HOST/SMTP_USER/SMTP_PASS أو RESEND_API_KEY." },
      { status: 400 }
    );
  }

  const tpl = welcomeEmail({ name: "تجربة" });
  const result = await sendEmail({
    to: to.trim(),
    subject: `[اختبار] ${tpl.subject}`,
    html: tpl.html,
    text: tpl.text,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: `فشل الإرسال (${result.error}). راجع بيانات SMTP في الـ logs.` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, via: status.via, from: status.from });
}
