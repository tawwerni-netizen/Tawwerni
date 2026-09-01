import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { pillars } from "@/content/hub-pillars";
import { LogoLink } from "@/components/Logo";

export const metadata: Metadata = {
  title: "مركز الذكاء الاصطناعي",
  description: "مقالات عملية عن استخدام الذكاء الاصطناعي — من غير كلام عام.",
  alternates: { canonical: "/hub" },
};

export default async function HubIndexPage() {
  const counts = await prisma.article.groupBy({
    by: ["pillar"],
    where: { status: "published" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.pillar, c._count._all]));

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/" className="tap px-2 py-2 text-xs text-neutral-500">
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-800">مركز الذكاء الاصطناعي</h1>
          <p className="text-sm text-neutral-500">مقالات عملية، مقسّمة حسب الموضوع.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pillars.map((p) => (
            <Link
              key={p.key}
              href={`/hub/${p.key}`}
              className="rounded-2xl border border-black/5 bg-white p-4 transition hover:border-brand-400"
            >
              <span className="mb-2 block text-2xl" aria-hidden>
                {p.icon}
              </span>
              <p className="mb-1 text-sm font-bold text-neutral-800">{p.title}</p>
              <p className="text-xs leading-relaxed text-neutral-500">{p.description}</p>
              <p className="mt-2 text-[11px] text-neutral-400">{countMap.get(p.key) ?? 0} مقال</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
