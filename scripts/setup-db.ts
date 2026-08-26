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
import { execFileSync } from "node:child_process";
import { askHidden } from "./ask-hidden";

const HOST = "de-fra-web1803.main-hosting.eu";
const PORT = 3306;
const DB = "u375891363_tawwerni";
const USER = "u375891363_tawwerni";

const ENV_FILE = ".env.local";

/** Replaces DATABASE_URL in .env.local, keeping every other line untouched. */
function writeUrl(url: string) {
  const existing = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  const line = `DATABASE_URL=${url}`;

  const updated = existing.match(/^DATABASE_URL=.*$/m)
    ? existing.replace(/^DATABASE_URL=.*$/m, line)
    : (existing.trimEnd() + "\n" + line + "\n").trimStart();

  writeFileSync(ENV_FILE, updated, "utf8");
}

function run(label: string, args: string[]) {
  console.log(`\n· ${label}…`);
  execFileSync("npx", args, { stdio: "inherit", shell: true });
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

  // Prove the credentials before running anything that assumes them.
  process.env.DATABASE_URL = url;
  const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
  try {
    const adapter = await new PrismaMariaDb(url).connect();
    await adapter.dispose();
    console.log("✓ الاتصال شغّال");
  } catch (err) {
    console.error("\n✗ الاتصال فشل.");
    console.error(`  ${err instanceof Error ? err.message : String(err)}`);
    console.error("\n  الأسباب الغالبة:");
    console.error("   · الباسورد غلط");
    console.error("   · Remote MySQL مش مفعّل لـ % في hPanel");
    process.exit(1);
  }

  run("بيبني الجداول", ["prisma", "db", "push", "--skip-generate"]);
  run("بيولّد الـclient", ["prisma", "generate"]);
  run("بيحطّ المسارات والدروس", ["tsx", "prisma/seed.ts"]);

  console.log("\n────────────────────────────────────────");
  console.log("✅ قاعدة البيانات جاهزة");
  console.log("\nفاضل حاجتين:");
  console.log("  ١. اعمل حسابك:");
  console.log(`     npx tsx scripts/create-admin.ts "tawwerni@gmail.com" "Hifzy"`);
  console.log("  ٢. حطّ نفس DATABASE_URL في متغيّرات hPanel:");
  console.log("     npx tsx scripts/print-env.ts");
  console.log("");
})();
