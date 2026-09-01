import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { pillars } from "@/content/hub-pillars";
import { logAdminAction } from "@/lib/audit-log";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validate(body: Record<string, unknown>) {
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const pillar = typeof body.pillar === "string" ? body.pillar : "";

  if (!SLUG_RE.test(slug)) return "الـslug لازم يكون حروف إنجليزي صغيرة وأرقام وشرطات بس";
  if (title.length < 5) return "العنوان قصير أوي";
  if (excerpt.length < 10) return "الملخص قصير أوي";
  if (content.length < 50) return "المحتوى قصير أوي";
  if (!pillars.some((p) => p.key === pillar)) return "اختار موضوع صحيح";
  return null;
}

export async function POST(request: Request) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const body = await readJson(request);
  const error = validate(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const existing = await prisma.article.findUnique({ where: { slug: body.slug as string } });
  if (existing) return NextResponse.json({ error: "الـslug ده مستخدم قبل كده" }, { status: 409 });

  let relatedCourseId: string | null = null;
  if (typeof body.relatedCourseId === "string" && body.relatedCourseId) {
    const c = await prisma.course.findUnique({ where: { id: body.relatedCourseId }, select: { id: true } });
    relatedCourseId = c?.id ?? null;
  }

  const article = await prisma.article.create({
    data: {
      slug: (body.slug as string).trim(),
      title: (body.title as string).trim(),
      excerpt: (body.excerpt as string).trim(),
      content: (body.content as string).trim(),
      pillar: body.pillar as string,
      icon: typeof body.icon === "string" && body.icon ? body.icon.trim().slice(0, 8) : "📄",
      seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() || null : null,
      seoDescription: typeof body.seoDescription === "string" ? body.seoDescription.trim() || null : null,
      readingMinutes: Number.isFinite(Number(body.readingMinutes)) ? Math.max(1, Math.round(Number(body.readingMinutes))) : 5,
      faq: typeof body.faq === "string" && body.faq.trim() ? body.faq.trim() : null,
      relatedCourseId,
      ctaText: typeof body.ctaText === "string" ? body.ctaText.trim() || null : null,
    },
  });

  await logAdminAction({ admin, action: "article.create", targetType: "article", targetId: article.id, detail: article.title });

  return NextResponse.json({ ok: true, id: article.id });
}
