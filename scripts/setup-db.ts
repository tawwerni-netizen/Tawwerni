/**
 * Points the project at the MySQL database and fills it.
 *
 *   npx tsx scripts/setup-db.ts
 *
 * Asks for the database password, writes DATABASE_URL into .env.local, proves
 * the connection works, then creates the tables and loads the courses.
 *
 * The password is asked for rather than typed into the command so it never
 * reaches the shell's history file. It is written only to .env.local, which
 * Git ignores.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { askHidden } from "./ask-hidden";

const HOST = "de-fra-web1803.main-hosting.eu";
const PORT = 3306;
const DB = "u375891363_tawwerni";
const USER = "u375891363_tawwerni";

const ENV_FILE = ".env.local";

// After a password change the tables and content are already there; only the
// connection string needs replacing.
const urlOnly = process.argv.includes("--url-only");

/** Replaces DATABASE_URL in .env.local, keeping every other line untouched. */
function writeUrl(url: string) {
  const existing = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  const line = `DATABASE_URL=${url}`;

  const updated = existing.match(/^DATABASE_URL=.*$/m)
    ? existing.replace(/^DATABASE_URL=.*$/m, line)
    : (existing.trimEnd() + "\n" + line + "\n").trimStart();

  writeFileSync(ENV_FILE, updated, "utf8");
}

function run(label: string, command: string) {
  console.log(`\n· ${label}…`);
  // One string rather than an args array: npx needs a shell on Windows, and
  // passing an array through a shell triggers a deprecation warning because
  // the arguments get concatenated rather than escaped.
  execSync(command, { stdio: "inherit" });
}

(async () => {
  console.log(`\nقاعدة البيانات: ${DB} على ${HOST}\n`);

  const password = await askHidden("باسورد قاعدة البيانات (مش هيظهر وانت بتكتب): ");
  if (!password) {
    console.error("✗ مكتبتش حاجة. وقفت.");
    process.exit(1);
  }

  // The password goes through a URL, so anything special in it has to be
  // escaped or the connection string silently parses wrong.
  const url = `mysql://${USER}:${encodeURIComponent(password)}@${HOST}:${PORT}/${DB}`;

  writeUrl(url);
  console.log(`✓ اتكتب في ${ENV_FILE}`);

  // Prove the credentials with a real query. Opening a pool proves nothing:
  // pools are lazy, so creating one succeeds even with a wrong password and
  // reports a connection that does not exist.
  process.env.DATABASE_URL = url;
  const mariadb = (await import("mariadb")).default;
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password,
      database: DB,
      connectTimeout: 15000,
    });
    await conn.query("SELECT 1");
    console.log("✓ الاتصال شغّال — اتجرّب باستعلام حقيقي");
  } catch (err) {
    console.error("\n✗ الاتصال فشل.");
    console.error(`  ${err instanceof Error ? err.message : String(err)}`);
    console.error("\n  الأسباب الغالبة:");
    console.error("   · الباسورد غلط — غيّره من hPanel وجرّب تاني");
    console.error("   · Remote MySQL مش مفعّل لـ % في hPanel");
    console.error("\n  ملحوظة: 'Access denied' معناها إن السيرفر ردّ ورفض —");
    console.error("  يعني الشبكة والعنوان تمام، والمشكلة في البيانات نفسها.");
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }

  if (urlOnly) {
    console.log("\n✅ الرابط اتحدّث. المحتوى زي ما هو.");
    console.log("   حطّ الرابط الجديد في hPanel كمان: npx tsx scripts/print-env.ts\n");
    return;
  }

  run("بيبني الجداول", "npx prisma db push");
  run("بيولّد الـclient", "npx prisma generate");
  run("بيحطّ المسارات والدروس", "npx tsx prisma/seed.ts");

  console.log("\n────────────────────────────────────────");
  console.log("✅ قاعدة البيانات جاهزة");
  console.log("\nفاضل حاجتين:");
  console.log("  ١. اعمل حسابك:");
  console.log(`     npx tsx scripts/create-admin.ts "tawwerni@gmail.com" "Hifzy"`);
  console.log("  ٢. حطّ نفس DATABASE_URL في متغيّرات hPanel:");
  console.log("     npx tsx scripts/print-env.ts");
  console.log("");
})();
