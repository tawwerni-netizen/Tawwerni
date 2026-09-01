import { prisma } from "@/lib/prisma";

const STARS = (n: number | null) => (n ? "⭐".repeat(n) : "");

/**
 * Real testimonials, or nothing.
 *
 * Renders no section at all — not a placeholder, not sample quotes — until
 * at least one learner's testimonial has actually been approved. An empty
 * "what our learners say" heading is worse than no heading: it announces
 * that nobody has said anything yet, which is the opposite of what a
 * testimonials section is for. See the certificate/quiz/homepage copy
 * elsewhere in this codebase for the same rule applied to every other number
 * on the site.
 */
export default async function Testimonials() {
  const items = await prisma.testimonial.findMany({
    where: { status: "approved" },
    orderBy: [{ featured: "desc" }, { decidedAt: "desc" }],
    take: 9,
    include: { course: { select: { title: true } } },
  });

  if (items.length === 0) return null;

  return (
    <div className="mx-auto mb-14 max-w-5xl">
      <h2 className="mb-7 text-center text-xl font-bold md:text-2xl">
        ماذا قال متعلمو {"طوّرني"}؟
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-black/5 bg-white p-5">
            {t.rating && <p className="mb-2 text-sm" dir="ltr">{STARS(t.rating)}</p>}
            <p className="mb-3 text-sm leading-relaxed text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-xs font-bold text-neutral-800">{t.holderName}</p>
            {t.course && <p className="text-[11px] text-neutral-400">{t.course.title}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
