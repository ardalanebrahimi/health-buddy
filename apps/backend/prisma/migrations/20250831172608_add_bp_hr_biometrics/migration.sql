-- CreateTable
CREATE TABLE "biometrics_bp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "pulse" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_bp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometrics_hr" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_hr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biometrics_bp_userId_takenAt_idx" ON "biometrics_bp"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "biometrics_hr_userId_takenAt_idx" ON "biometrics_hr"("userId", "takenAt");
