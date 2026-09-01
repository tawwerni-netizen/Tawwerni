/**
 * Linguistic proofreading pass over the 100 AI Hub articles published directly
 * into production. Read-only fetch, then targeted, idempotent single-field
 * fixes — only title/excerpt/content, never status/pillar/slug, and only for
 * concrete, specific errors identified by hand (not a rewrite).
 *
 * Safe to re-run: each fix checks the current DB value contains the exact
 * "before" string before writing, and logs skip/fix/already-fixed per slug.
 */
import "./load-env";
import { prisma } from "../src/lib/prisma";

async function withRetry<T>(fn: () => Promise<T>, label: string, attempts = 5): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.error(`[retry] ${label} attempt ${i}/${attempts} failed: ${(err as Error).message}`);
      if (i < attempts) await new Promise((r) => setTimeout(r, 8000));
    }
  }
  throw lastErr;
}

type Fix = {
  slug: string;
  field: "title" | "excerpt" | "content";
  before: string; // exact substring that must currently exist
  after: string; // exact replacement
  note: string;
};

// Every fix here is a single concrete, hand-identified error from a full
// read of all 100 articles (title + excerpt + content). Not a rewrite pass.
const fixes: Fix[] = [
  {
    slug: "farq-yestakhdem-ai-w-yefham-ai",
    field: "content",
    before: '## "بيفهم" يعني بيعرف امتى ولية وإزاي',
    after: '## "بيفهم" يعني بيعرف امتى وليه وإزاي',
    note: 'ة/ه confusion: "ولية" (a female guardian) should be "وليه" (and why) — heading made no sense as written.',
  },
];

(async () => {
  console.log(`proofread pass: ${fixes.length} fix(es) queued`);

  for (const fix of fixes) {
    const article = await withRetry(
      () => prisma.article.findUnique({ where: { slug: fix.slug }, select: { [fix.field]: true } as any }),
      `fetch ${fix.slug}`
    );

    if (!article) {
      console.log(`SKIP  ${fix.slug} — article not found`);
      continue;
    }

    const current = (article as any)[fix.field] as string;

    if (current.includes(fix.after) && !current.includes(fix.before)) {
      console.log(`DONE  ${fix.slug}.${fix.field} — already fixed, skipping`);
      continue;
    }

    if (!current.includes(fix.before)) {
      console.log(`WARN  ${fix.slug}.${fix.field} — expected text not found, skipping (manual check needed)`);
      console.log(`      expected to contain: ${JSON.stringify(fix.before)}`);
      continue;
    }

    const updated = current.replace(fix.before, fix.after);

    await withRetry(
      () =>
        prisma.article.update({
          where: { slug: fix.slug },
          data: { [fix.field]: updated } as any,
        }),
      `update ${fix.slug}`
    );

    console.log(`FIXED ${fix.slug}.${fix.field} — ${fix.note}`);
  }

  console.log("proofread pass complete");
  await prisma.$disconnect();
})();
