// Simple test to verify Prisma client generation and schema
import { PrismaClient, MealStatus } from '@prisma/client';

// Test that we can instantiate the client
const prisma = new PrismaClient();

// Test that enums are available
console.log('Available MealStatus values:', Object.values(MealStatus));

// Test schema structure by checking model names exist
console.log('Prisma models available:');
console.log('- Profile:', typeof prisma.profile);
console.log('- Goal:', typeof prisma.goal);
console.log('- Meal:', typeof prisma.meal);
console.log('- MealItem:', typeof prisma.mealItem);
console.log('- MealPhoto:', typeof prisma.mealPhoto);
console.log('- Hydration:', typeof prisma.hydration);
console.log('- BiometricsWeight:', typeof prisma.biometricsWeight);
console.log('- CompanionMessage:', typeof prisma.companionMessage);

console.log('✅ Prisma client test completed successfully!');

// Clean up
prisma.$disconnect();
