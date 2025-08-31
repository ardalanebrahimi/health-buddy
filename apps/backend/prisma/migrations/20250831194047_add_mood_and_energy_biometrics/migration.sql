-- CreateTable
CREATE TABLE "biometrics_mood" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moodChar" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_mood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometrics_energy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_energy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biometrics_mood_userId_takenAt_idx" ON "biometrics_mood"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "biometrics_energy_userId_takenAt_idx" ON "biometrics_energy"("userId", "takenAt");
