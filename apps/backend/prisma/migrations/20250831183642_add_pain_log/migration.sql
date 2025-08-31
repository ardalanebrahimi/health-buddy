-- CreateTable
CREATE TABLE "biometrics_pain" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "note" TEXT,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_pain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biometrics_pain_userId_takenAt_idx" ON "biometrics_pain"("userId", "takenAt");
