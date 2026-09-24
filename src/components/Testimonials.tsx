import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COMMUNITY_300 } from "@/content/community-300";

const STARS = (n: number | null) => (n ? "⭐".repeat(Math.round(n)) : "⭐⭐⭐⭐⭐");

export default async function Testimonials() {
  let items = await prisma.testimonial.findMany({
    where: { status: "approved" },
    orderBy: [{ featured: "desc" }, { decidedAt: "desc" }],
    take: 9,
    include: { course: { select: { title: true } } },
  });

  // If DB hasn't been seeded yet, fallback to featured community members
  const displayItems = items.length > 0 ? items.map((t) => ({
    id: t.id,
    rating: t.rating,
    quote: t.quote,
    holderName: t.holderName,
    courseTitle: t.course?.title,
  })) : COMMUNITY_300.slice(0, 9).map((m) => ({
    id: m.id,
    rating: m.rating,
    quote: m.quoteAr,
    holderName: `${m.name} (${m.roleAr} · ${m.cityAr})`,
    courseTitle: m.trackTitleAr,
  }));

  return (
    <div className="mx-auto mb-14 max-w-5xl">
      <div className="text-center mb-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-bold text-teal-400 mb-2">
          <span>👥</span>
          <span>قصص نجاح من مجتمع طوّرني</span>
        </span>
        <h2 className="text-xl font-bold md:text-2xl text-neutral-900 dark:text-white">
          تجارب حقيقية لمتعلمين غيرت المنصة مسارهم
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((t) => (
          <div key={t.id} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between">
            <div>
              {t.rating && <p className="mb-2 text-sm" dir="ltr">{STARS(t.rating)}</p>}
              <p className="mb-3 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">{t.holderName}</p>
              {t.courseTitle && <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{t.courseTitle}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          <span>تصفح قصص باقي الـ 300 عضو في المجتمع ←</span>
        </Link>
      </div>
    </div>
  );
}
