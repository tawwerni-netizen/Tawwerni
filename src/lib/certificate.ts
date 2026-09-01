import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Excludes 0/O and 1/I/L — the pairs people misread when copying a code off a
 * printed certificate or a phone screen held up to a laptop.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCode(): string {
  const bytes = randomBytes(10);
  let code = "";
  for (let i = 0; i < 10; i++) code += ALPHABET[bytes[i] % ALPHABET.length];
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}

type CompletionRow = {
  xpEarned: number;
  score: number | null;
  totalQuestions: number | null;
  completedAt: Date;
};

/**
 * Issues the certificate the first time a course is completed, and returns
 * the same one on every later visit.
 *
 * `@@unique([userId, courseId])` in the schema is what actually enforces
 * "one certificate per person per course" — this only decides what to do
 * when a row is already there. Snapshotting name/title/stats at issue time
 * (rather than joining live) is deliberate: a certificate looked up months
 * later by a stranger at /verify should read exactly as it did the day it
 * was earned, even if the learner renames their account afterwards.
 */
export async function getOrCreateCertificate({
  userId,
  courseId,
  holderName,
  courseTitle,
  completions,
}: {
  userId: string;
  courseId: string;
  holderName: string;
  courseTitle: string;
  completions: CompletionRow[];
}) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const scored = completions.filter(
    (c) => typeof c.score === "number" && (c.totalQuestions ?? 0) > 0
  );
  const avgScore = scored.length
    ? Math.round(
        (scored.reduce((s, c) => s + (c.score ?? 0) / (c.totalQuestions ?? 1), 0) /
          scored.length) *
          100
      )
    : null;

  // Collisions are astronomically unlikely (32^10 possibilities) but the
  // unique constraint means a retry costs nothing if one ever happens —
  // cheaper than trusting probability alone on something printed and shared.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.certificate.create({
        data: {
          code: generateCode(),
          userId,
          courseId,
          holderName,
          courseTitle,
          lessons: completions.length,
          totalXp,
          avgScore,
        },
      });
    } catch (err) {
      const isUniqueClash =
        err instanceof Error && "code" in err && (err as { code?: string }).code === "P2002";
      if (!isUniqueClash) throw err;
      // Someone else's create raced ours (double-tap, two tabs) — the row is
      // there now, so read it back instead of erroring the page.
      const raced = await prisma.certificate.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (raced) return raced;
    }
  }
  throw new Error("تعذّر إصدار الشهادة — جرّب تاني.");
}

export async function findCertificateByCode(code: string) {
  return prisma.certificate.findUnique({ where: { code } });
}
