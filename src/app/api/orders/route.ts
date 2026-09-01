import { NextResponse } from "next/server";
import { readJson, isOneOf } from "@/lib/read-json";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { pricing, payment } from "@/content/brand";
import { sendEmail } from "@/lib/email";
import { orderReceivedEmail } from "@/lib/email-templates";
import { attachReferrer } from "@/lib/referrals";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";

const VALID_METHODS = ["vodafone_cash", "instapay"] as const;
const VALID_CHANNELS = ["whatsapp", "email"] as const;

export async function POST(request: Request) {
  // Unauthenticated and it creates accounts, so a script could otherwise bury
  // the real orders in the admin panel under thousands of fake ones.
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`orders:${clientIp(request)}`, 10, 3600);
  if (!gate.ok) return tooMany(gate, "طلبات كتير من الجهاز ده. استنى شوية أو كلّمنا على واتساب.");

  const { email, name, phone, instapayName, courseSlug, method, proofChannel } = await readJson(request);

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
  if (!isOneOf(method, VALID_METHODS)) {
    return NextResponse.json({ error: "اختر طريقة دفع صحيحة" }, { status: 400 });
  }
  if (proofChannel != null && !isOneOf(proofChannel, VALID_CHANNELS)) {
    return NextResponse.json({ error: "قناة تواصل غير صالحة" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return NextResponse.json({ error: "المسار مش موجود" }, { status: 404 });

  const normalizedEmail = email.toLowerCase().trim();

  /*
   * This endpoint is public — checkout happens before anyone signs in — so a
   * stranger can name any address here. It used to upsert `name` and `phone`
   * unconditionally, which let anyone rewrite a paying customer's details from
   * the open internet, including the phone the payment matcher relies on.
   *
   * An established account (one with a password) keeps its own details; the
   * order still gets created and carries its own `senderPhone`, so checkout
   * works exactly the same for them.
   */
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, passwordHash: true },
  });

  const user = existing
    ? existing.passwordHash
      ? existing
      : await prisma.user.update({
          where: { id: existing.id },
          data: { name: name.trim(), phone: normalizedPhone },
          select: { id: true, name: true, passwordHash: true },
        })
    : await prisma.user.create({
        data: { email: normalizedEmail, name: name.trim(), phone: normalizedPhone },
        select: { id: true, name: true, passwordHash: true },
      });

  // Attribute the sale to whoever's link brought them here. Only ever applies
  // when this account has no referrer yet, so credit can't be reassigned later.
  const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
  await attachReferrer(user.id, refCode).catch(() => {});

  /*
   * Check-then-create, made atomic.
   *
   * A plain findFirst-then-create race: a double-click, or a slow network
   * retrying the same submit, can fire two requests close enough together
   * that both see "no open order yet" before either has committed its
   * insert — two pending orders for the same course. That is not just a
   * stray row: the payment matcher requires *exactly one* pending order at
   * a given phone+amount before it auto-activates anything, so a duplicate
   * here turns an otherwise-clean automatic activation into a manual-review
   * case for no real reason. `FOR UPDATE` on the user row serializes
   * concurrent requests for the same user, so the second one's check runs
   * only after the first one's insert has actually landed.
   */
  const order = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM User WHERE id = ${user.id} FOR UPDATE`;

    const openOrder = await tx.order.findFirst({
      where: { userId: user.id, courseId: course.id, status: { in: ["pending", "approved"] } },
    });
    if (openOrder) return { ...openOrder, alreadyExists: true as const };

    return tx.order.create({
      data: {
        userId: user.id,
        courseId: course.id,
        method,
        amountEgp: pricing.priceEgp,
        // السعر اللي اتدفع فعلًا — عشان أي تغيير في السعر بعدين
        // ما يغيّرش سجل عميل قديم.
        originalPriceEgp: pricing.priceEgp,
        status: "pending",
        proofChannel: typeof proofChannel === "string" ? proofChannel : null,
        senderPhone: normalizedPhone,
        instapayName:
          method === "instapay" && typeof instapayName === "string" && instapayName.trim()
            ? instapayName.trim()
            : null,
      },
    });
  });

  if ("alreadyExists" in order) {
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      alreadyExists: true,
      status: order.status,
    });
  }

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
