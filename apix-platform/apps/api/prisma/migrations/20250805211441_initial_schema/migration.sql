-- CreateEnum
CREATE TYPE "public"."ClientType" AS ENUM ('WEB_APP', 'MOBILE_APP', 'SDK_WIDGET', 'API_CLIENT', 'INTERNAL_SERVICE');

-- CreateEnum
CREATE TYPE "public"."ConnectionStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'RECONNECTING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."ChannelType" AS ENUM ('AGENT_EVENTS', 'TOOL_EVENTS', 'WORKFLOW_EVENTS', 'PROVIDER_EVENTS', 'SYSTEM_EVENTS', 'PRIVATE_USER', 'ORGANIZATION');

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apix_connections" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "clientType" "public"."ClientType" NOT NULL,
    "status" "public"."ConnectionStatus" NOT NULL DEFAULT 'CONNECTED',
    "channels" TEXT[],
    "metadata" JSONB,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastHeartbeat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnectedAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "apix_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apix_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "acknowledgment" BOOLEAN NOT NULL DEFAULT false,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "organizationId" TEXT NOT NULL,
    "connectionId" TEXT,
    "userId" TEXT,

    CONSTRAINT "apix_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apix_channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ChannelType" NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "settings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscribers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "apix_channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "public"."organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "apix_connections_sessionId_key" ON "public"."apix_connections"("sessionId");

-- CreateIndex
CREATE INDEX "apix_connections_organizationId_status_idx" ON "public"."apix_connections"("organizationId", "status");

-- CreateIndex
CREATE INDEX "apix_connections_sessionId_idx" ON "public"."apix_connections"("sessionId");

-- CreateIndex
CREATE INDEX "apix_connections_userId_idx" ON "public"."apix_connections"("userId");

-- CreateIndex
CREATE INDEX "apix_events_organizationId_eventType_idx" ON "public"."apix_events"("organizationId", "eventType");

-- CreateIndex
CREATE INDEX "apix_events_channel_createdAt_idx" ON "public"."apix_events"("channel", "createdAt");

-- CreateIndex
CREATE INDEX "apix_events_connectionId_idx" ON "public"."apix_events"("connectionId");

-- CreateIndex
CREATE INDEX "apix_events_processed_createdAt_idx" ON "public"."apix_events"("processed", "createdAt");

-- CreateIndex
CREATE INDEX "apix_channels_organizationId_type_idx" ON "public"."apix_channels"("organizationId", "type");

-- CreateIndex
CREATE INDEX "apix_channels_name_idx" ON "public"."apix_channels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "apix_channels_organizationId_name_key" ON "public"."apix_channels"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apix_connections" ADD CONSTRAINT "apix_connections_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apix_connections" ADD CONSTRAINT "apix_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apix_events" ADD CONSTRAINT "apix_events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apix_events" ADD CONSTRAINT "apix_events_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "public"."apix_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apix_events" ADD CONSTRAINT "apix_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apix_channels" ADD CONSTRAINT "apix_channels_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
