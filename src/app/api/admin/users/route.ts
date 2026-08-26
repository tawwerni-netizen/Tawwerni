import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { hashPassword, passwordProblem } from "@/lib/password";
import { pricing, payment } from "@/content/brand";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";
import { activateOrder } from "@/lib/activate-order";

/**
 * Creating an account from the panel.
 *
 * The owner sells over WhatsApp, so this is the path for "somebody paid me in
 * person and I need them in the system now". Optionally opens the subscription
 * in the same step, through the same `activateOrder` choke-point that an
 * automatically matched transfer goes through — so the commission, the email
 * and the access all behave identically no matter how the sale happened.
 */
export async function POST(request: Request) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { email, name, phone, password, grantAccess } = await request.json();

  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!normalizedEmail.includes("@") || normalizedEmail.length < 5) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }

  const problem = passwordProblem(password);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "فيه حساب بالإيميل ده بالفعل. استخدم «مشكلة في الدخول؟» بدل ما تعمل واحد جديد." },
      { status: 409 }
    );
  }

  const normalizedPhone =
    typeof phone === "string" ? phone.replace(/\D/g, "") : "";

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: typeof name === "string" && name.trim() ? name.trim().slice(0, 60) : null,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
      passwordHash: await hashPassword(password),
      // The owner picked this password, so the learner has to replace it.
      mustChangePassword: true,
      dailyPaceMinutes: 15,
    },
    select: { id: true, email: true, name: true },
  });

  let activated = false;
  if (grantAccess) {
    const course = await prisma.course.findFirst({
      where: { isComingSoon: false },
      orderBy: { order: "asc" },
      select: { id: true },
    });
    if (course) {
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          courseId: course.id,
          method: "manual",
          amountEgp: pricing.priceEgp,
          originalPriceEgp: pricing.originalPriceEgp,
          status: "pending",
        },
        select: { id: true },
      });
      await activateOrder(order.id, `أضافه الأدمن (${admin.email})`);
      activated = true;
    }
  }

  const tpl = welcomeEmail({ name: user.name });
  await sendEmail({
    to: user.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: payment.supportEmail,
  });

  return NextResponse.json({
    ok: true,
    userId: user.id,
    activated,
    note: activated
      ? "الحساب اتعمل والاشتراك اتفعّل. ابعت للعميل الإيميل والباسورد — هيتطلب منه يغيّره أول دخول."
      : "الحساب اتعمل. ابعت للعميل الإيميل والباسورد — هيتطلب منه يغيّره أول دخول.",
  });
}
