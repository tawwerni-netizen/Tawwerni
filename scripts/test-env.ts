import { config } from "dotenv";

/**
 * Loads the same variables the dev server sees.
 *
 * `import "dotenv/config"` only reads `.env`, and this project keeps its real
 * values in `.env.local` — so the scripts were running with an empty
 * `JWT_SECRET` and silently skipping the rate-limit bypass. Later files do not
 * override earlier ones, so `.env.local` wins, matching Next's own precedence.
 */
config({ path: [".env.local", ".env"] });

/**
 * Header that opts a test run out of rate limiting.
 *
 * The server honours it only outside production, and only when it matches
 * `JWT_SECRET`. Empty when the secret isn't loaded, in which case the suites
 * simply run throttled.
 */
export const TEST_HEADERS: Record<string, string> = process.env.JWT_SECRET
  ? { "x-tawwerni-test": process.env.JWT_SECRET }
  : {};

if (!process.env.JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET مش محمّل — الاختبارات هتشتغل مع حد المعدل شغّال.");
}
