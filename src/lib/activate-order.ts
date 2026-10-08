import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { courseActivatedEmail } from "@/lib/email-templates";
import { creditReferral } from "@/lib/referrals";
import { grantUserEntitlement } from "@/lib/entitlements";
import { CAREER_PATHS, getCareerPathBySlug, getCareerPathsForTrack } from "@/content/career-paths";
import { getTrackBySlug } from "@/content/tracks100";

/**
 * Single place an order becomes active.
 *
 * Automatic SMS matching, the admin's "grant access" button, webhooks and manual linking
 * all route through here.
 *
 * Automatically handles tier upgrades & price difference calculations:
 * - 59 EGP -> Track
 * - 90 EGP (149 - 59) -> Upgrades Track to Career Path
 * - 149 EGP -> Career Path
 * - 250 EGP (399 - 149) -> Upgrades Career Path to All-Access
 * - 340 EGP (399 - 59) -> Upgrades Track to All-Access
 * - 399 EGP (or >= 300) -> All-Access Pass (All 100 Tracks & 12 Career Paths)
 * - Cumulative spend >= 149 -> Upgrades to Career Path
 * - Cumulative spend >= 399 -> Upgrades to All-Access Pass
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

  // Calculate user lifetime spend across previous approved orders to honor upgrade differences
  let totalLifetimeSpend = order.amountEgp;
  try {
    const priorApproved = await prisma.order.findMany({
      where: { userId: order.userId, status: "approved", id: { not: order.id } },
      select: { amountEgp: true, productType: true, productSlug: true },
    });
    totalLifetimeSpend += priorApproved.reduce((sum, o) => sum + (o.amountEgp || 0), 0);
  } catch (err) {
    console.error("Error calculating lifetime spend:", err);
  }

  // Determine Tier and Entitlements
  const isAllAccess =
    order.productType === "all_access" ||
    order.productType === "all_access_pass" ||
    order.amountEgp >= 300 ||
    (order.amountEgp >= 240 && order.amountEgp <= 260) || // 250 EGP upgrade from Career Path
    (order.amountEgp >= 330 && order.amountEgp <= 350) || // 340 EGP upgrade from Track
    totalLifetimeSpend >= 399;

  const isCareerPath =
    !isAllAccess &&
    (order.productType === "career_path" ||
      (order.amountEgp >= 135 && order.amountEgp < 300) || // 149 EGP Career Path payment
      (order.amountEgp >= 85 && order.amountEgp <= 95) ||  // 90 EGP upgrade from Track
      totalLifetimeSpend >= 149);

  // Grant V2 Entitlements
  try {
    if (isAllAccess) {
      // All-Access Pass (399 EGP) / Legacy -> full library access (all 100 tracks + 12 paths)
      await grantUserEntitlement({
        userId: order.userId,
        productType: "all_access",
        productSlug: "global_all_access",
        source: "order_activation",
        orderId: order.id,
      });
      await grantUserEntitlement({
        userId: order.userId,
        productType: "legacy_full_access",
        productSlug: "global_all_access",
        source: "order_activation",
        orderId: order.id,
      });

      // Synchronize order record to reflect upgraded product
      if (order.productType !== "all_access") {
        await prisma.order.update({
          where: { id: order.id },
          data: { productType: "all_access", productSlug: "global_all_access" },
        }).catch(() => {});
      }
    } else if (isCareerPath) {
      // Career Path bundle (149 EGP or 90 EGP upgrade)
      // Resolve target Career Path
      let targetPathSlug = order.productSlug;
      let validPath = targetPathSlug ? getCareerPathBySlug(targetPathSlug) : undefined;

      // If productSlug was a track slug, find parent career path
      if (!validPath && targetPathSlug) {
        const parentPaths = getCareerPathsForTrack(targetPathSlug);
        if (parentPaths.length > 0) {
          validPath = parentPaths[0].careerPath;
          targetPathSlug = validPath.slug;
        }
      }

      // If still not found, check previous user track orders to infer career path
      if (!validPath) {
        try {
          const userOrders = await prisma.order.findMany({
            where: { userId: order.userId, productSlug: { not: null } },
            select: { productSlug: true },
          });
          for (const uo of userOrders) {
            if (uo.productSlug) {
              const cp = getCareerPathBySlug(uo.productSlug);
              if (cp) { validPath = cp; targetPathSlug = cp.slug; break; }
              const parent = getCareerPathsForTrack(uo.productSlug);
              if (parent.length > 0) { validPath = parent[0].careerPath; targetPathSlug = parent[0].careerPath.slug; break; }
            }
          }
        } catch {}
      }

      // Fallback to flagship Career Path if unspecified
      if (!validPath) {
        validPath = CAREER_PATHS[0];
      }
      const finalPathSlug: string = validPath?.slug || targetPathSlug || "fullstack-developer";

      await grantUserEntitlement({
        userId: order.userId,
        productType: "career_path",
        productSlug: finalPathSlug,
        source: "order_activation",
        orderId: order.id,
      });

      // If user also specified a direct track, grant direct track entitlement as well
      const directTrackSlug = order.course?.slug || (order.productSlug !== finalPathSlug ? order.productSlug : null);
      if (directTrackSlug && getTrackBySlug(directTrackSlug)) {
        await grantUserEntitlement({
          userId: order.userId,
          productType: "track",
          productSlug: directTrackSlug,
          source: "order_activation",
          orderId: order.id,
        }).catch(() => {});
      }

      // Synchronize order record to reflect upgraded product
      if (order.productType !== "career_path" || order.productSlug !== finalPathSlug) {
        await prisma.order.update({
          where: { id: order.id },
          data: { productType: "career_path", productSlug: finalPathSlug },
        }).catch(() => {});
      }
    } else {
      // Track (59 EGP) -> grants individual track entitlement
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

  if (isAllAccess) {
    displayTitle = "الوصول الشامل لكافة الكورسات والمسارات المهنية (All-Access Pass)";
    displaySlug = "all_access";
  } else if (isCareerPath) {
    const targetSlug = order.productSlug || CAREER_PATHS[0]?.slug;
    const cp = targetSlug ? getCareerPathBySlug(targetSlug) : undefined;
    if (cp) {
      displayTitle = `المسار المهني: ${cp.titleAr}`;
      displaySlug = cp.slug;
    } else {
      displayTitle = "المسار المهني الشامل (Career Path)";
      displaySlug = "career-path";
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
