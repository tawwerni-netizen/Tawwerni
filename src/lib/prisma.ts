import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * The database connection.
 *
 * MySQL, not a file. The old SQLite file lived inside the deployed build
 * directory, which Hostinger replaces wholesale on every deploy — so every
 * release quietly started from an empty database and the site looked healthy
 * while serving nothing. A managed database sits outside the deploy cycle.
 *
 * There is no fallback URL on purpose: a default would let the app boot
 * against the wrong database and fail silently, which is exactly the failure
 * that cost a day of hunting.
 *
 * The connection is built on first use rather than on import. `next build`
 * imports every route module to collect its config, and the build machine has
 * no reason to hold database credentials — validating at import time would
 * turn a missing variable into a failed build instead of a clear runtime error.
 */
function connect(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL مش موجود. الموقع مش هيشتغل من غيره.\n" +
        "حطّه في إعدادات الـ Node.js في hPanel بالشكل ده:\n" +
        "  mysql://user:password@host:3306/dbname"
    );
  }

  if (url.startsWith("file:")) {
    throw new Error(
      "DATABASE_URL لسه على صيغة SQLite القديمة (file:...).\n" +
        "المشروع بقى على MySQL — غيّره لـ mysql://user:password@host:3306/dbname"
    );
  }

  return new PrismaClient({ adapter: new PrismaMariaDb(tuned(url)) });
}

/**
 * Connection settings the driver's defaults get wrong for this setup.
 *
 * `connectionLimit`: shared hosting caps how many connections one account may
 * hold, and Passenger can run several app processes at once — each with its
 * own pool. The default of 10 per process runs into that ceiling; 5 does not.
 *
 * `connectTimeout`: the driver gives up after one second. In production the
 * database is on localhost and that is plenty, but a developer connecting from
 * another country never completes a handshake that fast — so the default turns
 * every local script into a confusing timeout.
 *
 * Anything already spelled out in the URL wins.
 */
function tuned(raw: string): string {
  const params: string[] = [];
  if (!/[?&]connectionLimit=/i.test(raw)) params.push("connectionLimit=5");
  if (!/[?&]connectTimeout=/i.test(raw)) params.push("connectTimeout=15000");
  if (!params.length) return raw;
  return raw + (raw.includes("?") ? "&" : "?") + params.join("&");
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined;

function client_(): PrismaClient {
  if (client) return client;
  client = globalForPrisma.prisma ?? connect();
  // Dev reloads the module on every edit; without this each reload would open
  // another pool and the connection limit would be hit within minutes.
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(client_(), prop, receiver);
    return typeof value === "function" ? value.bind(client_()) : value;
  },
}) as PrismaClient;
