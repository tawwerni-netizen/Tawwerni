import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads .env.local and treats it as the local source of truth. The
// Prisma CLI only reads .env, so a stale value there silently won the argument
// and the CLI ended up pointed at a different database than the app. Load
// .env.local first — dotenv does not overwrite what is already set, so the
// first file to define a variable wins.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
