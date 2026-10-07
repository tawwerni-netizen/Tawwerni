import { NextResponse } from "next/server";
import { readJson, isOneOf } from "@/lib/read-json";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { payment } from "@/content/brand";
import { sendEmail } from "@/lib/email";
import { orderReceivedEmail } from "@/lib/email-templates";
import { attachReferrer } from "@/lib/referrals";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";
import { ensureDbCourse } from "@/lib/db-course";
import { calculateOrderPrice } from "@/lib/pricing";
import { getCareerPathBySlug } from "@/content/career-paths";

const VALID_METHODS = ["vodafone_cash", "instapay"] as const;
const VALID_CHANNELS = ["whatsapp", "email"] as const;

export async function POST(request: Request) {
  // Unauthenticated and it creates accounts, so rate limit prevents flooding
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`orders:${clientIp(request)}`, 10, 3600);
  if (!gate.ok) return tooMany(gate, "طلبات كتير من الجهاز ده. استنى شوية أو كلّمنا على واتساب.");

  const {
    email,
    name,
    phone,
    instapayName,
    courseSlug,
    productType,
    productSlug,
    method,
    proofChannel,
    withOrderBump,
    utm,
  } = await readJson(request);

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

  // InstaPay receipts have no phone number, so the payer name is required
  if (method === "instapay" && (typeof instapayName !== "string" || instapayName.trim().length < 3)) {
    return NextResponse.json({ error: "اكتب اسمك زي ما هو على حسابك في إنستاباي" }, { status: 400 });
  }

  if (!isOneOf(method, VALID_METHODS)) {
    return NextResponse.json({ error: "اختر طريقة دفع صحيحة" }, { status: 400 });
  }
  if (proofChannel != null && !isOneOf(proofChannel, VALID_CHANNELS)) {
    return NextResponse.json({ error: "قناة تواصل غير صالحة" }, { status: 400 });
  }

  const resolvedType =
    typeof productType === "string" && (productType === "all_access" || productType === "all_access_pass")
      ? "all_access"
      : typeof productType === "string" && productType === "career_path"
      ? "career_path"
      : "track";

  const resolvedSlug =
    resolvedType === "all_access"
      ? "all_access"
      : (typeof productSlug === "string" && productSlug) || (typeof courseSlug === "string" && courseSlug) || "";

  if (!resolvedSlug) {
    return NextResponse.json({ error: "اختر المسار أو التخصص أولاً" }, { status: 400 });
  }

  // Calculate pricing strictly server-side (59 EGP Track, 149 EGP Career Path, 399 EGP All-Access)
  const priceCalc = calculateOrderPrice({
    productType: resolvedType,
    productSlug: resolvedSlug,
    withOrderBump: Boolean(withOrderBump),
  });

  if (!priceCalc) {
    return NextResponse.json({ error: "المنتج أو المسار المطلوب غير موجود" }, { status: 404 });
  }

  const { product, totalPriceEgp } = priceCalc;

  // Determine course to link in database for foreign key integrity
  let courseLinkSlug = product.slug;
  if (product.type === "all_access") {
    courseLinkSlug = "fullstack-web-developer";
  } else if (product.type === "career_path") {
    const cp = getCareerPathBySlug(product.slug);
    const firstTrack = cp?.stages?.[0]?.tracks?.[0]?.trackSlug || "fullstack-web-developer";
    courseLinkSlug = firstTrack;
  }

  const course = await ensureDbCourse(courseLinkSlug);
  if (!course) return NextResponse.json({ error: "المسار مش موجود" }, { status: 404 });

  const normalizedEmail = email.toLowerCase().trim();

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

  const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
  await attachReferrer(user.id, refCode).catch(() => {});

  const isVipUpgrade = Boolean(withOrderBump);

  const order = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM User WHERE id = ${user.id} FOR UPDATE`;

    const openOrder = await tx.order.findFirst({
      where: {
        userId: user.id,
        status: { in: ["pending", "approved"] },
        OR: [
          { productType: resolvedType, productSlug: resolvedSlug },
          { courseId: course.id },
        ],
      },
    });

    if (openOrder) {
      if (openOrder.status === "pending" && isVipUpgrade && openOrder.amountEgp < totalPriceEgp) {
        const upgraded = await tx.order.update({
          where: { id: openOrder.id },
          data: {
            amountEgp: totalPriceEgp,
            originalPriceEgp: totalPriceEgp,
            productType: resolvedType,
            productSlug: resolvedSlug,
          },
        });
        return { ...upgraded, alreadyExists: true as const, upgraded: true as const };
      }
      return { ...openOrder, alreadyExists: true as const };
    }

    return tx.order.create({
      data: {
        userId: user.id,
        courseId: course.id,
        method,
        productType: resolvedType,
        productSlug: resolvedSlug,
        amountEgp: totalPriceEgp,
        originalPriceEgp: totalPriceEgp,
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
      productType: resolvedType,
      productSlug: resolvedSlug,
      amountEgp: order.amountEgp,
    });
  }

  // Send order received email
  const tpl = orderReceivedEmail({
    name: user.name,
    courseTitle: product.titleAr,
    method,
  });
  await sendEmail({
    to: normalizedEmail,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: payment.supportEmail,
  });

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    productType: resolvedType,
    productSlug: resolvedSlug,
    productTitle: product.titleAr,
    amountEgp: totalPriceEgp,
  });
}
