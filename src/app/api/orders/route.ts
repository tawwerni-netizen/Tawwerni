import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pricing, payment } from "@/content/brand";
import { sendEmail } from "@/lib/email";
import { orderReceivedEmail } from "@/lib/email-templates";

const VALID_METHODS = ["vodafone_cash", "instapay"] as const;
const VALID_CHANNELS = ["whatsapp", "email"] as const;

export async function POST(request: Request) {
  const { email, name, phone, instapayName, courseSlug, method, proofChannel } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "اكتب اسمك بالكامل" }, { status: 400 });
  }
  // The wallet number is what lets us match an incoming transfer to this order.
  const normalizedPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
  if (!/^01\d{9}$/.test(normalizedPhone)) {
    return NextResponse.json({ error: "رقم الموبايل لازم يكون ١١ رقم ويبدأ بـ 01" }, { status: 400 });
  }
  // InstaPay receipts have no phone number, so the payer name is the only
  // thing that can attribute the transfer — require it up front.
  if (method === "instapay" && (typeof instapayName !== "string" || instapayName.trim().length < 3)) {
    return NextResponse.json({ error: "اكتب اسمك زي ما هو على حسابك في إنستاباي" }, { status: 400 });
  }
  if (typeof courseSlug !== "string" || !courseSlug) {
    return NextResponse.json({ error: "اختر المسار الأول" }, { status: 400 });
  }
  if (!VALID_METHODS.includes(method)) {
    return NextResponse.json({ error: "اختر طريقة دفع صحيحة" }, { status: 400 });
  }
  if (proofChannel != null && !VALID_CHANNELS.includes(proofChannel)) {
    return NextResponse.json({ error: "قناة تواصل غير صالحة" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return NextResponse.json({ error: "المسار مش موجود" }, { status: 404 });

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { name: name.trim(), phone: normalizedPhone },
    create: { email: normalizedEmail, name: name.trim(), phone: normalizedPhone },
  });

  const existing = await prisma.order.findFirst({
    where: { userId: user.id, courseId: course.id, status: { in: ["pending", "approved"] } },
  });
  if (existing) {
    return NextResponse.json({
      ok: true,
      orderId: existing.id,
      alreadyExists: true,
      status: existing.status,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      courseId: course.id,
      method,
      amountEgp: pricing.priceEgp,
      originalPriceEgp: pricing.originalPriceEgp,
      status: "pending",
      proofChannel: typeof proofChannel === "string" ? proofChannel : null,
      senderPhone: normalizedPhone,
      instapayName:
        method === "instapay" && typeof instapayName === "string" && instapayName.trim()
          ? instapayName.trim()
          : null,
    },
  });

  // Receipt is best-effort: a mail outage must never lose the order.
  const tpl = orderReceivedEmail({
    name: user.name,
    courseTitle: course.title,
    method,
  });
  await sendEmail({
    to: normalizedEmail,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: payment.supportEmail,
  });

  return NextResponse.json({ ok: true, orderId: order.id, courseTitle: course.title });
}
