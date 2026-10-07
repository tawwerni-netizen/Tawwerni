const PAGES = [
  "/",
  "/tracks",
  "/career-paths",
  "/quiz",
  "/community",
  "/refund",
  "/faq",
  "/about",
  "/terms",
  "/freelancing",
  "/ai",
  "/coding",
  "/design",
  "/data",
];

const FORBIDDEN_PATTERNS = [
  { name: "300 عضو موثق", test: (text: string) => text.includes("300 عضو موثق") },
  { name: "300+", test: (text: string) => /300\s*\+|٣٠٠\s*\+/.test(text) },
  { name: "94% (habit adherence)", test: (text: string) => /94%/.test(text) },
  { name: "7 أيام (refund)", test: (text: string) => /7\s*أيام\s*(استرجاع|ضمان)|ضمان\s*الـ?7\s*أيام/i.test(text) },
  { name: "650 دولار", test: (text: string) => /650\s*(USD|\$|دولار)/i.test(text) },
  { name: "12 ألف ريال", test: (text: string) => /12,?000\s*(SAR|ريال)|12\s*ألف\s*ريال/i.test(text) },
  { name: "3 أضعاف", test: (text: string) => /3\s*أضعاف|3x\s*(pricing|تسعير)/i.test(text) },
  { name: "45% (acquisition)", test: (text: string) => /45%\s*(acquisition|تخفيض|تكلفة)/i.test(text) },
  { name: "ضعف الراتب", test: (text: string) => /ضعف\s*الراتب|salary\s*doubl/i.test(text) },
  { name: "مدى الحياة", test: (text: string) => text.includes("مدى الحياة") },
  { name: "ملكية دائمة", test: (text: string) => text.includes("ملكية دائمة") },
  { name: "Lifetime", test: (text: string) => /\blifetime\b/i.test(text) },
  { name: "Forever", test: (text: string) => /\bforever\b/i.test(text) },
];

async function checkUrl(path: string) {
  const url = `https://tawwerni.com${path}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store",
    });
    const html = await res.text();
    const status = res.status;

    // Strip percent-encoded URL sequences to avoid matching substring bytes in share URLs
    const cleanedText = html.replace(/%[0-9A-Fa-f]{2}/g, " ");

    const foundForbidden: string[] = [];
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(cleanedText)) {
        foundForbidden.push(pattern.name);
      }
    }

    return { path, status, foundForbidden, ok: foundForbidden.length === 0 };
  } catch (err: any) {
    return { path, status: 0, foundForbidden: [], ok: false, error: err.message };
  }
}

async function run() {
  console.log("🌐 AUDITING LIVE PRODUCTION PAGES (TAWWERNI V4.8)...");
  console.log(`Target: https://tawwerni.com`);
  console.log(`Checking ${PAGES.length} pages against ${FORBIDDEN_PATTERNS.length} forbidden marketing claims...\n`);

  let allPassed = true;

  for (const page of PAGES) {
    const result = await checkUrl(page);
    if (!result.ok || result.status !== 200) {
      allPassed = false;
      console.log(`❌ [HTTP ${result.status}] ${page}: VIOLATIONS: ${result.foundForbidden.join(", ") || result.error}`);
    } else {
      console.log(`✅ [HTTP ${result.status}] ${page}: 100% CLEAN`);
    }
  }

  console.log("\n========================================================");
  if (allPassed) {
    console.log("🏆 ALL 14 LIVE PAGES PASSED: 100% CLEAN OF FORBIDDEN CLAIMS!");
  } else {
    console.log("⚠️ SOME PAGES FAILED AUDIT!");
  }
  console.log("========================================================\n");
}

run();
