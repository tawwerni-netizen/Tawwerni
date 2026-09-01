import { config } from "dotenv";
config({ path: ".env.local" });
import { prisma } from "../src/lib/prisma";

(async () => {
  const rows = await prisma.adminAuditLog.findMany({ orderBy: { createdAt: "asc" } });
  for (const r of rows) {
    console.log(r.createdAt.toISOString(), r.adminEmail, r.action, r.targetType, r.detail ?? "");
  }
  await prisma.$disconnect();
})();
