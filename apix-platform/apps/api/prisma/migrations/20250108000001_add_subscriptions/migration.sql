-- CreateTable
CREATE TABLE "apix_subscriptions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "filters" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apix_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apix_subscriptions_organizationId_userId_channel_key" ON "apix_subscriptions"("organizationId", "userId", "channel");

-- CreateIndex
CREATE INDEX "apix_subscriptions_organizationId_idx" ON "apix_subscriptions"("organizationId");

-- CreateIndex
CREATE INDEX "apix_subscriptions_userId_idx" ON "apix_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "apix_subscriptions_organizationId_channel_idx" ON "apix_subscriptions"("organizationId", "channel");

-- CreateIndex
CREATE INDEX "apix_subscriptions_organizationId_userId_idx" ON "apix_subscriptions"("organizationId", "userId");

-- AddForeignKey
ALTER TABLE "apix_subscriptions" ADD CONSTRAINT "apix_subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apix_subscriptions" ADD CONSTRAINT "apix_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create audit log for migration
INSERT INTO "audit_logs" ("id", "organizationId", "action", "resourceType", "success", "severity", "category", "metadata")
SELECT 
    gen_random_uuid(),
    "id",
    'MIGRATION',
    'Database',
    true,
    'HIGH',
    'SYSTEM_ACCESS',
    '{"migration": "add_subscriptions", "version": "20250108000001"}'
FROM "organizations";
