/**
 * Prints the environment block to paste into hPanel → Node.js → Environment.
 *
 * Reads the values you already have locally so the deployed app keeps working
 * with the same sessions and the same Android app token. Run it, copy the
 * output, paste it into the panel — no value gets typed by hand and mistyped.
 *
 *   npx tsx scripts/print-env.ts
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

function read(file: string): Record<string, string> {
  if (!existsSync(file)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

// .env.local wins: it is the file that holds the real working values.
const env = { ...read(".env"), ...read(".env.local") };

/**
 * The server talks to MySQL over localhost.
 *
 * The app and the database live on the same machine, so the external hostname
 * is a detour — and depending on it would mean leaving Remote MySQL open to
 * the whole internet forever. Your own machine still needs the external host,
 * which is why .env.local keeps it and only this block is rewritten.
 */
function forServer(url: string): string {
  if (!url.startsWith("mysql://")) return url;
  try {
    const u = new URL(url);
    u.hostname = "localhost";
    return u.toString();
  } catch {
    return url;
  }
}

const rows: [string, string, string][] = [
  [
    "DATABASE_URL",
    env.DATABASE_URL ? forServer(env.DATABASE_URL) : "mysql://user:password@localhost:3306/dbname  ← لسه مش متظبط",
    "بيانات الاتصال بـMySQL — localhost لأن التطبيق على نفس السيرفر",
  ],
  ["JWT_SECRET", env.JWT_SECRET || randomBytes(32).toString("base64url"), "لو اتغيّر، كل الناس هتتطرد من حساباتها"],
  ["PUBLIC_ORIGIN", "https://tawwerni.com", "لينكات الإيميل وبطاقة الواتساب"],
  ["PAYMENT_INGEST_TOKEN", env.PAYMENT_INGEST_TOKEN || randomBytes(24).toString("base64url"), "لازم يطابق تطبيق الأندرويد بالحرف"],
  ["NODE_ENV", "production", ""],
];

const optional: [string, string, string][] = [
  ["ANTHROPIC_API_KEY", env.ANTHROPIC_API_KEY || "", "شات فهيم — من غيره الشات بس بيتعطّل"],
  ["SMTP_HOST", env.SMTP_HOST || "smtp.hostinger.com", "الإيميلات"],
  ["SMTP_PORT", env.SMTP_PORT || "465", ""],
  ["SMTP_USER", env.SMTP_USER || "noreply@tawwerni.com", ""],
  ["SMTP_PASS", env.SMTP_PASS || "", "باسورد صندوق البريد اللي هتعمله في hPanel"],
  ["EMAIL_FROM", env.EMAIL_FROM || "noreply@tawwerni.com", ""],
];

const lines: string[] = [];
lines.push("════════ إجباري — من غيرهم الموقع مش هيقوم ════════", "");
for (const [k, v] of rows) lines.push(`${k}=${v}`);

lines.push("", "════════ الإيميلات وفهيم ════════", "");
for (const [k, v, note] of optional) {
  lines.push(v ? `${k}=${v}` : `# ${k}=   ← ناقص عندك · ${note}`);
}

console.log("\n" + lines.join("\n"));

// Written to a file as well, because copying a 43-character secret out of a
// terminal by eye is how a deploy quietly fails an hour later.
const OUT = ".env.hostinger.txt";
writeFileSync(OUT, lines.join("\r\n") + "\r\n", "utf8");

const reused = {
  JWT_SECRET: !!env.JWT_SECRET,
  PAYMENT_INGEST_TOKEN: !!env.PAYMENT_INGEST_TOKEN,
};
console.log("\n────────────────────────────────────────");
console.log(reused.JWT_SECRET ? "✓ JWT_SECRET: نفس القديم — الجلسات هتفضل شغّالة" : "⚠ JWT_SECRET: جديد اتولّد دلوقتي");
console.log(reused.PAYMENT_INGEST_TOKEN ? "✓ PAYMENT_INGEST_TOKEN: نفس القديم — التطبيق هيفضل شغّال" : "⚠ PAYMENT_INGEST_TOKEN: جديد — لازم تحطه في التطبيق كمان");
console.log("");
console.log(`📄 اتكتبوا كمان في ملف: ${OUT}`);
console.log("   افتحه بالـNotepad وانسخ منه — أسهل وأأمن من النسخ من الشاشة:");
console.log(`   notepad ${OUT}`);
console.log("");
console.log("⚠ الملف ده فيه أسرار. مستثنى من Git، بس امسحه بعد ما تخلص الرفع.");
console.log("");
