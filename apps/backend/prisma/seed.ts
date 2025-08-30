import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo profile
  const profile = await prisma.profile.upsert({
    where: { userId: DEMO_USER_ID },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      userId: DEMO_USER_ID,
      sex: 'male',
      age: 35,
      heightCm: 180,
      weightKg: 110.4,
      activityLevel: 'moderate',
      baselineJson: {
        conditions: ['back pain'],
        painAreas: ['lower back'],
        notes: 'Desk worker, occasional gym sessions',
      },
    },
  });

  console.log('✅ Created profile:', profile.id);

  // Create demo goal
  const goal = await prisma.goal.upsert({
    where: { userId: DEMO_USER_ID },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      userId: DEMO_USER_ID,
      weightGoalKg: 95.0,
      proteinTargetG: 150,
      calorieTargetKcal: 2200,
      sleepHoursTarget: 8,
      painTarget: 3,
    },
  });

  console.log('✅ Created goal:', goal.id);

  // Create demo meal with item and photo
  const meal = await prisma.meal.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      userId: DEMO_USER_ID,
      takenAt: new Date(),
      status: 'final',
      totalsJson: {
        calories: 650,
        protein: 45,
        carbs: 30,
        fat: 25,
      },
      notes: 'Grilled chicken with vegetables',
    },
  });

  console.log('✅ Created meal:', meal.id);

  // Create meal item
  const mealItem = await prisma.mealItem.upsert({
    where: { id: '00000000-0000-0000-0000-000000000005' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      mealId: meal.id,
      name: 'Grilled Chicken Breast',
      portionGrams: 200,
      calories: 330,
      protein: 30,
      carbs: 0,
      fat: 7.4,
      confidence: 0.95,
      editedByUser: false,
    },
  });

  console.log('✅ Created meal item:', mealItem.id);

  // Create meal photo
  const mealPhoto = await prisma.mealPhoto.upsert({
    where: { mealId: meal.id },
    update: {},
    create: {
      mealId: meal.id,
      photoUrl: 'https://example.com/placeholder-meal-photo.jpg',
      width: 1024,
      height: 768,
      exifJson: {
        cameraMake: 'Apple',
        cameraModel: 'iPhone 14',
        timestamp: new Date().toISOString(),
      },
    },
  });

  console.log('✅ Created meal photo for meal:', mealPhoto.mealId);

  // Create hydration entry
  const hydration = await prisma.hydration.upsert({
    where: { id: '00000000-0000-0000-0000-000000000006' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      userId: DEMO_USER_ID,
      amountMl: 250,
      takenAt: new Date(),
    },
  });

  console.log('✅ Created hydration entry:', hydration.id);

  // Create weight entry
  const weightEntry = await prisma.biometricsWeight.upsert({
    where: { id: '00000000-0000-0000-0000-000000000007' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      userId: DEMO_USER_ID,
      valueKg: 110.4,
      takenAt: new Date(),
    },
  });

  console.log('✅ Created weight entry:', weightEntry.id);

  // Create companion message for today
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set to midnight UTC

  const companionMessage = await prisma.companionMessage.upsert({
    where: {
      userId_date: {
        userId: DEMO_USER_ID,
        date: today,
      },
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000008',
      userId: DEMO_USER_ID,
      date: today,
      note: 'Great job logging your meals today! Your protein intake is on track, and remember to stay hydrated. Consider a short walk after dinner to aid digestion.',
    },
  });

  console.log('✅ Created companion message:', companionMessage.id);

  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
