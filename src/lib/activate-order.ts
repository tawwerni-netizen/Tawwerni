import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { courseActivatedEmail } from "@/lib/email-templates";
import { creditReferral } from "@/lib/referrals";
import { grantUserEntitlement } from "@/lib/entitlements";
import { getCareerPathBySlug } from "@/content/career-paths";
import { getTrackBySlug } from "@/content/tracks100";

/**
 * Single place an order becomes active.
 *
 * Automatic SMS matching, the admin's "grant access" button and manual linking
 * all route through here. Automatically creates proper V2 entitlements!
 */
export async function activateOrder(orderId: string, note: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, course: true },
  });
  if (!order) return null;

  if (order.status !== "approved") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "approved", approvedAt: new Date() },
    });
  }

  // Grant V2 Entitlements
  try {
    const isLegacyAmount = order.amountEgp >= 300;
    const isCareerPath = order.productType === "career_path";

    if (isLegacyAmount) {
      // Legacy 349/350 EGP subscription -> full library access
      await grantUserEntitlement({
        userId: order.userId,
        productType: "legacy_full_access",
        productSlug: "global_all_access",
        source: "order_activation",
        orderId: order.id,
      });
    } else if (isCareerPath && order.productSlug) {
      // Career Path bundle (100 EGP) -> grants career path entitlement
      await grantUserEntitlement({
        userId: order.userId,
        productType: "career_path",
        productSlug: order.productSlug,
        source: "order_activation",
        orderId: order.id,
      });
    } else {
      // Track (50 EGP) -> grants individual track entitlement
      const trackSlug = order.productSlug || order.course?.slug;
      if (trackSlug) {
        await grantUserEntitlement({
          userId: order.userId,
          productType: "track",
          productSlug: trackSlug,
          source: "order_activation",
          orderId: order.id,
        });
      }
    }
  } catch (err) {
    console.error("Error granting entitlement on activation:", err);
  }

  // Pay the referrer, if any. Idempotent, so re-approving cannot double-pay.
  await creditReferral(orderId).catch(() => {});

  // Determine display title for email
  let displayTitle = order.course.title;
  let displaySlug = order.course.slug;

  if (order.productType === "career_path" && order.productSlug) {
    const cp = getCareerPathBySlug(order.productSlug);
    if (cp) {
      displayTitle = `المسار المهني: ${cp.titleAr}`;
      displaySlug = cp.slug;
    }
  } else if (order.productSlug) {
    const track = getTrackBySlug(order.productSlug);
    if (track) {
      displayTitle = track.titleAr;
      displaySlug = track.slug;
    }
  }

  const tpl = courseActivatedEmail({
    name: order.user.name,
    courseTitle: displayTitle,
    courseSlug: displaySlug,
    amountEgp: order.amountEgp,
  });

  // Never let a mail failure roll back an activation the customer paid for.
  await sendEmail({
    to: order.user.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  return {
    orderId: order.id,
    email: order.user.email,
    courseTitle: displayTitle,
    courseSlug: displaySlug,
    note,
  };
}
