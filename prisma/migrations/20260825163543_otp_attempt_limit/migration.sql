-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailOtp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "consumedAt" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_EmailOtp" ("codeHash", "consumedAt", "createdAt", "email", "expiresAt", "id") SELECT "codeHash", "consumedAt", "createdAt", "email", "expiresAt", "id" FROM "EmailOtp";
DROP TABLE "EmailOtp";
ALTER TABLE "new_EmailOtp" RENAME TO "EmailOtp";
CREATE INDEX "EmailOtp_email_idx" ON "EmailOtp"("email");
CREATE INDEX "EmailOtp_email_createdAt_idx" ON "EmailOtp"("email", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
