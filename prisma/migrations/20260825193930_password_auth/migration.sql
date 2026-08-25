-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "referralCode" TEXT,
    "referredById" TEXT,
    "passwordHash" TEXT,
    "avatarUrl" TEXT,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "welcomedAt" DATETIME,
    "dailyPaceMinutes" INTEGER,
    "focusCategory" TEXT,
    "quizAnswers" TEXT,
    "aiReadinessScore" INTEGER,
    "archetype" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("aiReadinessScore", "archetype", "createdAt", "dailyPaceMinutes", "email", "focusCategory", "id", "name", "phone", "quizAnswers", "referralCode", "referredById", "welcomedAt") SELECT "aiReadinessScore", "archetype", "createdAt", "dailyPaceMinutes", "email", "focusCategory", "id", "name", "phone", "quizAnswers", "referralCode", "referredById", "welcomedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
CREATE INDEX "User_referredById_idx" ON "User"("referredById");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
