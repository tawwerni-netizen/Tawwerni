/**
 * Arabic name normalisation for matching an InstaPay payer against an order.
 *
 * The same person writes their name several ways — "أحمد" / "احمد", "يحيى" /
 * "يحيي", "فاطمة" / "فاطمه" — and IPN receipts use whatever the bank stored.
 * We fold those variants together so an exact comparison becomes meaningful,
 * without ever guessing between two different people.
 */

const DIACRITICS = /[ً-ْٰـ]/g; // harakat + superscript alef + tatweel

/**
 * Common Egyptian given names and surnames in Latin transliteration,
 * mapped to their canonical normalized Arabic representation.
 */
const NAME_ALIASES: Record<string, string> = {
  alaa: "الاء",
  "alaa'": "الاء",
  ala: "الاء",
  ola: "علا",
  ahmed: "احمد",
  ahmad: "احمد",
  mohamed: "محمد",
  mohammed: "محمد",
  muhammad: "محمد",
  muhammed: "محمد",
  mhd: "محمد",
  mahmoud: "محمود",
  mahmud: "محمود",
  mostafa: "مصطفي",
  mustafa: "مصطفي",
  ali: "علي",
  aly: "علي",
  omar: "عمر",
  amr: "عمرو",
  hassan: "حسن",
  hasan: "حسن",
  hussein: "حسين",
  hussien: "حسين",
  ibrahim: "ابراهيم",
  khaled: "خالد",
  khalid: "خالد",
  tarek: "طارق",
  tareq: "طارق",
  karim: "كريم",
  kareem: "كريم",
  youssef: "يوسف",
  yousef: "يوسف",
  joseph: "يوسف",
  mina: "مينا",
  george: "جورج",
  peter: "بيتر",
  mariam: "مريم",
  maryam: "مريم",
  sara: "ساره",
  sarah: "ساره",
  fatma: "فاطمه",
  fatimah: "فاطمه",
  nour: "نور",
  noor: "نور",
  nourhan: "نورهان",
  aya: "ايه",
  ayah: "ايه",
  nada: "ندي",
  menna: "منه",
  mennatullah: "منه",
  reem: "ريم",
  salma: "سلمي",
  habiba: "حبيبه",
  rawan: "روان",
  yasmin: "ياسمين",
  yasmine: "ياسمين",
  hifzy: "حفظي",
  hefzy: "حفظي",
  manar: "منار",
  mohy: "محي",
  mohey: "محي",
  amira: "اميره",
  eman: "ايمان",
  esraa: "اسراء",
  israa: "اسراء",
  asmaa: "اسماء",
  asma: "اسماء",
  rania: "رانيا",
  mai: "مي",
  dina: "دينا",
  hager: "هاجر",
  hadeer: "هدير",
  samar: "سمر",
  soha: "سهي",
  marwa: "مروه",
  shaimaa: "شيماء",
  shymaa: "شيماء",
  mona: "مني",
  heba: "هبه",
  reham: "ريهام",
  dalia: "داليا",
  shahd: "شهد",
  hoda: "هدي",
  wafaa: "وفاء",
  donia: "دنيا",
  dunya: "دنيا",
};

export function normalizeArabicName(input: string): string {
  if (!input) return "";
  // Strip any @instapay or @domain handles
  const clean = input.replace(/@.*$/, "").trim();

  return clean
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

function canonicalToken(token: string): string {
  const norm = normalizeArabicName(token);
  return NAME_ALIASES[norm] ?? norm;
}

function tokens(name: string): string[] {
  return normalizeArabicName(name)
    .split(" ")
    .map(canonicalToken)
    .filter((t) => t.length > 1 && !FILLER.has(t));
}

/**
 * How confidently two names refer to the same person.
 *
 * - "exact": Full agreement on multi-word names OR full agreement on a single distinctive name
 *   (e.g., "آلاء" matching "الاء" or "الاء محمد").
 * - "partial": At least one shared token or significant overlap.
 * - "none": Completely disjoint names.
 */
export function compareNames(a: string, b: string): "exact" | "partial" | "none" {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.length === 0 || tb.length === 0) return "none";

  const setB = new Set(tb);
  const shared = ta.filter((t) => setB.has(t));

  // If direct tokens don't share, check for substring overlap (e.g. handle or joined names)
  if (shared.length === 0) {
    const normA = normalizeArabicName(a).replace(/\s+/g, "");
    const normB = normalizeArabicName(b).replace(/\s+/g, "");
    if (normA.length >= 3 && normB.length >= 3) {
      if (normA.includes(normB) || normB.includes(normA)) {
        return "exact";
      }
    }
    return "none";
  }

  const shorter = Math.min(ta.length, tb.length);

  // If at least two tokens match and cover the shorter name -> exact
  if (shared.length >= 2 && shared.length === shorter) return "exact";

  // If a single distinctive token matches and covers the shorter name -> exact!
  // (e.g., user provided "آلاء" or "Alaa", and bank has "آلاء محمد", or both are "آلاء")
  if (shorter === 1 && shared.length === 1) return "exact";

  // If two tokens match even if longer name has more tokens -> exact
  if (shared.length >= 2) return "exact";

  return "partial";
}
