import type { PrismaClient } from "@/generated/prisma/client";

let isSynced = false;
let isSyncing = false;

/**
 * Checks whether a column exists in the current database table.
 */
async function checkColumnExists(
  prisma: PrismaClient,
  table: string,
  column: string
): Promise<boolean> {
  try {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = '${table}' 
         AND COLUMN_NAME = '${column}' 
       LIMIT 1;`
    );
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

/**
 * Ensures all required columns and tables exist in the live database.
 * Completely idempotent and safe to run on every startup.
 */
export async function ensureDatabaseSchema(prisma: PrismaClient): Promise<void> {
  if (isSynced || isSyncing) return;
  isSyncing = true;

  try {
    // 1. Column: User.hasLegacyAccess
    const hasLegacy = await checkColumnExists(prisma, "User", "hasLegacyAccess");
    if (!hasLegacy) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `User` ADD COLUMN `hasLegacyAccess` TINYINT(1) NOT NULL DEFAULT 0;"
      ).catch((err: any) => console.warn("[db-sync] ALTER User hasLegacyAccess:", err?.message));
    }

    // 2. Column: User.sessionVersion
    const hasSessionVer = await checkColumnExists(prisma, "User", "sessionVersion");
    if (!hasSessionVer) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `User` ADD COLUMN `sessionVersion` INT NOT NULL DEFAULT 0;"
      ).catch((err: any) => console.warn("[db-sync] ALTER User sessionVersion:", err?.message));
    }

    // 3. Column: User.welcomedAt
    const hasWelcomedAt = await checkColumnExists(prisma, "User", "welcomedAt");
    if (!hasWelcomedAt) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `User` ADD COLUMN `welcomedAt` DATETIME(3) NULL;"
      ).catch((err: any) => console.warn("[db-sync] ALTER User welcomedAt:", err?.message));
    }

    // 4. Column: User.mustChangePassword
    const hasMustChange = await checkColumnExists(prisma, "User", "mustChangePassword");
    if (!hasMustChange) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `User` ADD COLUMN `mustChangePassword` TINYINT(1) NOT NULL DEFAULT 0;"
      ).catch((err: any) => console.warn("[db-sync] ALTER User mustChangePassword:", err?.message));
    }

    // 5. Column: User.loginAttempts
    const hasAttempts = await checkColumnExists(prisma, "User", "loginAttempts");
    if (!hasAttempts) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `User` ADD COLUMN `loginAttempts` INT NOT NULL DEFAULT 0;"
      ).catch((err: any) => console.warn("[db-sync] ALTER User loginAttempts:", err?.message));
    }

    // 6. Column: User.lockedUntil
    const hasLockedUntil = await checkColumnExists(prisma, "User", "lockedUntil");
    if (!hasLockedUntil) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `User` ADD COLUMN `lockedUntil` DATETIME(3) NULL;"
      ).catch((err: any) => console.warn("[db-sync] ALTER User lockedUntil:", err?.message));
    }

    // 7. Column: Order.productType
    const hasProductType = await checkColumnExists(prisma, "Order", "productType");
    if (!hasProductType) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `Order` ADD COLUMN `productType` VARCHAR(191) NULL DEFAULT 'track';"
      ).catch((err: any) => console.warn("[db-sync] ALTER Order productType:", err?.message));
    }

    // 8. Column: Order.productSlug
    const hasProductSlug = await checkColumnExists(prisma, "Order", "productSlug");
    if (!hasProductSlug) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE `Order` ADD COLUMN `productSlug` VARCHAR(191) NULL;"
      ).catch((err: any) => console.warn("[db-sync] ALTER Order productSlug:", err?.message));
    }

    // 9. Table: UserEntitlement
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`UserEntitlement\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`userId\` VARCHAR(191) NOT NULL,
        \`productType\` VARCHAR(191) NOT NULL,
        \`productSlug\` VARCHAR(191) NOT NULL,
        \`source\` VARCHAR(191) NOT NULL DEFAULT 'direct_purchase',
        \`orderId\` VARCHAR(191) NULL,
        \`grantedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY \`UserEntitlement_userId_productType_productSlug_key\` (\`userId\`, \`productType\`, \`productSlug\`),
        INDEX \`UserEntitlement_userId_idx\` (\`userId\`),
        INDEX \`UserEntitlement_productSlug_idx\` (\`productSlug\`),
        INDEX \`UserEntitlement_productType_idx\` (\`productType\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `).catch((err: any) => console.warn("[db-sync] CREATE UserEntitlement:", err?.message));

    // 10. Table: Article
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Article\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`slug\` VARCHAR(191) NOT NULL UNIQUE,
        \`pillar\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(191) NOT NULL,
        \`excerpt\` TEXT NOT NULL,
        \`content\` TEXT NOT NULL,
        \`icon\` VARCHAR(191) NOT NULL DEFAULT '📄',
        \`seoTitle\` VARCHAR(191) NULL,
        \`seoDescription\` TEXT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
        \`readingMinutes\` INT NOT NULL DEFAULT 5,
        \`faq\` TEXT NULL,
        \`relatedCourseId\` VARCHAR(191) NULL,
        \`ctaText\` VARCHAR(191) NULL,
        \`publishedAt\` DATETIME(3) NULL,
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX \`Article_status_pillar_idx\` (\`status\`, \`pillar\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `).catch(() => {});

    // 11. Table: LeadMagnetRequest
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`LeadMagnetRequest\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`email\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NULL,
        \`magnetKey\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX \`LeadMagnetRequest_magnetKey_idx\` (\`magnetKey\`),
        INDEX \`LeadMagnetRequest_email_idx\` (\`email\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `).catch(() => {});

    // 12. Table: AdminAuditLog
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`AdminAuditLog\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`adminId\` VARCHAR(191) NOT NULL,
        \`adminEmail\` VARCHAR(191) NOT NULL,
        \`action\` VARCHAR(191) NOT NULL,
        \`targetType\` VARCHAR(191) NOT NULL,
        \`targetId\` VARCHAR(191) NULL,
        \`detail\` TEXT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX \`AdminAuditLog_createdAt_idx\` (\`createdAt\`),
        INDEX \`AdminAuditLog_targetType_targetId_idx\` (\`targetType\`, \`targetId\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `).catch(() => {});

    isSynced = true;
    console.log("[db-sync] Schema check and sync completed successfully.");
  } catch (err: any) {
    console.error("[db-sync] Error during schema synchronization:", err?.message || err);
  } finally {
    isSyncing = false;
  }
}
