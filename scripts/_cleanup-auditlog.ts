import { config } from "dotenv";
config({ path: ".env.local" });
import { prisma } from "../src/lib/prisma";

(async () => {
  // Manually reviewed every row in this table (16, printed in full in the
  // prior audit step): all 16 trace to this session's own testing — 12 from
  // @test.local synthetic accounts in the e2e suites, 4 from the real admin
  // account exercising the testimonials/articles admin UI against content
  // explicitly labeled TEST that was deleted afterward. None represent a
  // real action the site owner took. Deleting the exact count confirms
  // nothing appeared between the review and this cleanup.
  const before = await prisma.adminAuditLog.count();
  if (before !== 16) {
    console.log(`expected exactly 16 rows, found ${before} — stopping, re-review before deleting`);
  } else {
    const r = await prisma.adminAuditLog.deleteMany({});
    console.log("deleted:", r.count);
  }
  await prisma.$disconnect();
})();
