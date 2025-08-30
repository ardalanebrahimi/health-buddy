-- CreateEnum
CREATE TYPE "MealStatus" AS ENUM ('draft', 'recognized', 'final');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sex" TEXT,
    "age" INTEGER,
    "heightCm" INTEGER,
    "weightKg" DECIMAL(5,1),
    "activityLevel" TEXT,
    "baselineJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weightGoalKg" DECIMAL(5,1),
    "proteinTargetG" INTEGER,
    "calorieTargetKcal" INTEGER,
    "sleepHoursTarget" INTEGER,
    "painTarget" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3),
    "status" "MealStatus" NOT NULL DEFAULT 'draft',
    "totalsJson" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_items" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "portionGrams" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "editedByUser" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "meal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_photos" (
    "mealId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "exifJson" JSONB,

    CONSTRAINT "meal_photos_pkey" PRIMARY KEY ("mealId")
);

-- CreateTable
CREATE TABLE "hydration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountMl" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hydration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometrics_weight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valueKg" DECIMAL(5,1) NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometrics_weight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companion_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companion_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "goals_userId_key" ON "goals"("userId");

-- CreateIndex
CREATE INDEX "meals_userId_takenAt_idx" ON "meals"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "meal_items_mealId_idx" ON "meal_items"("mealId");

-- CreateIndex
CREATE INDEX "hydration_userId_takenAt_idx" ON "hydration"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "biometrics_weight_userId_takenAt_idx" ON "biometrics_weight"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "companion_messages_userId_date_idx" ON "companion_messages"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "companion_messages_userId_date_key" ON "companion_messages"("userId", "date");

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_photos" ADD CONSTRAINT "meal_photos_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
