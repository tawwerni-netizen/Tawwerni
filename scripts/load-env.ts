/**
 * Loads the local environment for scripts.
 *
 * Next.js reads .env.local on its own; a plain `tsx scripts/…` run does not.
 * Without this, anything importing src/lib/prisma dies with "DATABASE_URL مش
 * موجود" even though the file is right there.
 *
 * Import it first, before anything that touches the database:
 *
 *   import "./load-env";
 *   import { prisma } from "../src/lib/prisma";
 *
 * .env.local wins over .env — dotenv keeps the first value it sees.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();
