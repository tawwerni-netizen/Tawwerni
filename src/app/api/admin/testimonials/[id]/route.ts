import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit-log";

/**
 * Every decision an admin makes on a submitted testimonial.
 *
 * `approve`/`reject` are the review queue. `feature`/`unfeature` only make
 * sense on something already approved. `edit` exists for the typo or the
 * line that reads better tightened — the learner's meaning stays theirs,
 * this is not a rewrite tool.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { id } = await params;
  const body = await readJson(request);
  const { action } = body;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return NextResponse.json({ error: "مش موجود" }, { status: 404 });

  if (action === "approve" || action === "reject") {
    await prisma.testimonial.update({
      where: { id },
      data: { status: action === "approve" ? "approved" : "rejected", decidedAt: new Date(), decidedBy: admin.email },
    });
    await logAdminAction({
      admin,
      action: action === "approve" ? "testimonial.approve" : "testimonial.reject",
      targetType: "testimonial",
      targetId: id,
      detail: testimonial.holderName,
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "feature" || action === "unfeature") {
    if (testimonial.status !== "approved") {
      return NextResponse.json({ error: "لازم يكون موافَق عليه الأول" }, { status: 409 });
    }
    await prisma.testimonial.update({ where: { id }, data: { featured: action === "feature" } });
    await logAdminAction({
      admin,
      action: action === "feature" ? "testimonial.feature" : "testimonial.unfeature",
      targetType: "testimonial",
      targetId: id,
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "edit") {
    const quote = typeof body.quote === "string" ? body.quote.trim() : "";
    if (quote.length < 10 || quote.length > 800) {
      return NextResponse.json({ error: "النص لازم يكون بين 10 و800 حرف" }, { status: 400 });
    }
    const holderName = typeof body.holderName === "string" && body.holderName.trim()
      ? body.holderName.trim().slice(0, 60)
      : testimonial.holderName;

    await prisma.testimonial.update({ where: { id }, data: { quote, holderName } });
    await logAdminAction({ admin, action: "testimonial.edit", targetType: "testimonial", targetId: id });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}
