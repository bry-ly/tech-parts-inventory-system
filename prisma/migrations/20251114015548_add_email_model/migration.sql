-- CreateTable
CREATE TABLE "email" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "toName" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "folder" TEXT NOT NULL DEFAULT 'inbox',
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_userId_folder_idx" ON "email"("userId", "folder");

-- CreateIndex
CREATE INDEX "email_userId_createdAt_idx" ON "email"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "email_userId_isRead_idx" ON "email"("userId", "isRead");
