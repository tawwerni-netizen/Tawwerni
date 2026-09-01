import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { pillars } from "@/content/hub-pillars";
import { logAdminAction } from "@/lib/audit-log";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { id } = await params;
  const body = await readJson(request);
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "المقال مش موجود" }, { status: 404 });

  if (body.action === "publish" || body.action === "unpublish") {
    await prisma.article.update({
      where: { id },
      data: {
        status: body.action === "publish" ? "published" : "draft",
        publishedAt: body.action === "publish" ? (article.publishedAt ?? new Date()) : article.publishedAt,
      },
    });
    await logAdminAction({
      admin,
      action: body.action === "publish" ? "article.publish" : "article.unpublish",
      targetType: "article",
      targetId: id,
      detail: article.title,
    });
    return NextResponse.json({ ok: true });
  }

  // Full field edit.
  const slug = typeof body.slug === "string" ? body.slug.trim() : article.slug;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "الـslug لازم يكون حروف إنجليزي صغيرة وأرقام وشرطات بس" }, { status: 400 });
  }
  if (slug !== article.slug) {
    const clash = await prisma.article.findUnique({ where: { slug } });
    if (clash) return NextResponse.json({ error: "الـslug ده مستخدم قبل كده" }, { status: 409 });
  }

  const pillar = typeof body.pillar === "string" && pillars.some((p) => p.key === body.pillar) ? body.pillar : article.pillar;

  let relatedCourseId: string | null = article.relatedCourseId;
  if (body.relatedCourseId !== undefined) {
    if (typeof body.relatedCourseId === "string" && body.relatedCourseId) {
      const c = await prisma.course.findUnique({ where: { id: body.relatedCourseId }, select: { id: true } });
      relatedCourseId = c?.id ?? null;
    } else {
      relatedCourseId = null;
    }
  }

  await prisma.article.update({
    where: { id },
    data: {
      slug,
      pillar,
      title: typeof body.title === "string" && body.title.trim() ? body.title.trim() : article.title,
      excerpt: typeof body.excerpt === "string" && body.excerpt.trim() ? body.excerpt.trim() : article.excerpt,
      content: typeof body.content === "string" && body.content.trim() ? body.content.trim() : article.content,
      icon: typeof body.icon === "string" && body.icon ? body.icon.trim().slice(0, 8) : article.icon,
      seoTitle: body.seoTitle !== undefined ? (body.seoTitle as string).trim() || null : article.seoTitle,
      seoDescription: body.seoDescription !== undefined ? (body.seoDescription as string).trim() || null : article.seoDescription,
      readingMinutes: Number.isFinite(Number(body.readingMinutes)) ? Math.max(1, Math.round(Number(body.readingMinutes))) : article.readingMinutes,
      faq: body.faq !== undefined ? (typeof body.faq === "string" && body.faq.trim() ? body.faq.trim() : null) : article.faq,
      relatedCourseId,
      ctaText: body.ctaText !== undefined ? (body.ctaText as string).trim() || null : article.ctaText,
    },
  });

  await logAdminAction({ admin, action: "article.edit", targetType: "article", targetId: id, detail: article.title });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id }, select: { title: true } });
  if (!article) return NextResponse.json({ error: "المقال مش موجود" }, { status: 404 });

  await prisma.article.delete({ where: { id } });
  await logAdminAction({ admin, action: "article.delete", targetType: "article", targetId: id, detail: article.title });
  return NextResponse.json({ ok: true });
}
