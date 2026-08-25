import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { courseActivatedEmail } from "@/lib/email-templates";

/**
 * Single place an order becomes active.
 *
 * Automatic SMS matching, the admin's "grant access" button and manual linking
 * all route through here, so the learner gets the same confirmation email no
 * matter which path opened their course.
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

  const tpl = courseActivatedEmail({
    name: order.user.name,
    courseTitle: order.course.title,
    courseSlug: order.course.slug,
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
    courseTitle: order.course.title,
    courseSlug: order.course.slug,
    note,
  };
}
