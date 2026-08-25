-- CreateTable
CREATE TABLE "ReferralEarning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amountEgp" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "payoutId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralEarning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEarning_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEarning_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "Payout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amountEgp" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "note" TEXT,
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" DATETIME,
    CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "dailyPaceMinutes" INTEGER,
    "focusCategory" TEXT,
    "quizAnswers" TEXT,
    "aiReadinessScore" INTEGER,
    "archetype" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("aiReadinessScore", "archetype", "createdAt", "dailyPaceMinutes", "email", "focusCategory", "id", "name", "phone", "quizAnswers") SELECT "aiReadinessScore", "archetype", "createdAt", "dailyPaceMinutes", "email", "focusCategory", "id", "name", "phone", "quizAnswers" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
CREATE INDEX "User_referredById_idx" ON "User"("referredById");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ReferralEarning_orderId_key" ON "ReferralEarning"("orderId");

-- CreateIndex
CREATE INDEX "ReferralEarning_userId_status_idx" ON "ReferralEarning"("userId", "status");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");
