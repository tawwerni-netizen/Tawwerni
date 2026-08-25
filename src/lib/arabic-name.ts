/**
 * Arabic name normalisation for matching an InstaPay payer against an order.
 *
 * The same person writes their name several ways — "أحمد" / "احمد", "يحيى" /
 * "يحيي", "فاطمة" / "فاطمه" — and IPN receipts use whatever the bank stored.
 * We fold those variants together so an exact comparison becomes meaningful,
 * without ever guessing between two different people.
 */

const DIACRITICS = /[ً-ْٰـ]/g; // harakat + superscript alef + tatweel

export function normalizeArabicName(input: string): string {
  return input
    .normalize("NFKC")
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // drop punctuation, keep letters/digits
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Word set, ignoring order and the connectors Arabic names pick up. */
const FILLER = new Set(["عبد", "ال", "بن", "بنت", "el", "al", "abd", "abdel"]);

function tokens(name: string): string[] {
  return normalizeArabicName(name)
    .split(" ")
    .filter((t) => t.length > 1 && !FILLER.has(t));
}

/**
 * How confidently two names refer to the same person.
 *
 * Returns "exact" only when every meaningful word of the shorter name appears
 * in the longer one AND at least two words line up — a single shared first name
 * like "محمد" is far too common to act on.
 */
export function compareNames(a: string, b: string): "exact" | "partial" | "none" {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.length === 0 || tb.length === 0) return "none";

  const setB = new Set(tb);
  const shared = ta.filter((t) => setB.has(t));

  if (shared.length === 0) return "none";

  const shorter = Math.min(ta.length, tb.length);
  if (shared.length >= 2 && shared.length === shorter) return "exact";
  if (shared.length >= 2) return "partial";
  return "partial";
}
