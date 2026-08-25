-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "amountEgp" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "transactionRef" TEXT,
    "fingerprint" TEXT NOT NULL,
    "senderPhone" TEXT,
    "receiverPhone" TEXT,
    "transactionAt" DATETIME,
    "smsReceivedAt" DATETIME,
    "rawSms" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unmatched',
    "matchedOrderId" TEXT,
    "matchNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentTransaction_matchedOrderId_fkey" FOREIGN KEY ("matchedOrderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_transactionRef_key" ON "PaymentTransaction"("transactionRef");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_fingerprint_key" ON "PaymentTransaction"("fingerprint");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE INDEX "PaymentTransaction_senderPhone_idx" ON "PaymentTransaction"("senderPhone");

-- CreateIndex
CREATE INDEX "Order_senderPhone_idx" ON "Order"("senderPhone");
