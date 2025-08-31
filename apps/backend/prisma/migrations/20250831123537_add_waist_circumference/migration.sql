-- CreateTable
CREATE TABLE "biometrics_waist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valueCm" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_waist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biometrics_waist_userId_takenAt_idx" ON "biometrics_waist"("userId", "takenAt");
