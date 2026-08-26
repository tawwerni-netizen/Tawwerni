/**
 * Prints the environment block to paste into hPanel → Node.js → Environment.
 *
 * Reads the values you already have locally so the deployed app keeps working
 * with the same sessions and the same Android app token. Run it, copy the
 * output, paste it into the panel — no value gets typed by hand and mistyped.
 *
 *   npx tsx scripts/print-env.ts
 */
import { readFileSync, existsSync } from "node:fs";
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

const rows: [string, string, string][] = [
  ["DATABASE_URL", "file:./dev.db", "مكان قاعدة البيانات"],
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

console.log("\n════════ إجباري — من غيرهم الموقع مش هيقوم ════════\n");
for (const [k, v] of rows) console.log(`${k}=${v}`);

console.log("\n════════ الإيميلات وفهيم ════════\n");
for (const [k, v, note] of optional) {
  if (v) console.log(`${k}=${v}`);
  else console.log(`# ${k}=   ← ناقص عندك · ${note}`);
}

const reused = {
  JWT_SECRET: !!env.JWT_SECRET,
  PAYMENT_INGEST_TOKEN: !!env.PAYMENT_INGEST_TOKEN,
};
console.log("\n────────────────────────────────────────");
console.log(reused.JWT_SECRET ? "✓ JWT_SECRET: نفس القديم — الجلسات هتفضل شغّالة" : "⚠ JWT_SECRET: جديد اتولّد دلوقتي");
console.log(reused.PAYMENT_INGEST_TOKEN ? "✓ PAYMENT_INGEST_TOKEN: نفس القديم — التطبيق هيفضل شغّال" : "⚠ PAYMENT_INGEST_TOKEN: جديد — لازم تحطه في التطبيق كمان");
console.log("");
