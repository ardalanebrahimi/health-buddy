import { Router } from 'express';

const router = Router();

// GET /profile - Get user profile
router.get('/profile', (req, res) => {
  res.json({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    heightCm: 175.5,
    activityLevel: 'moderately_active',
    createdAt: '2025-08-30T10:00:00Z',
    updatedAt: '2025-08-30T10:00:00Z',
  });
});

// PUT /profile - Update user profile
router.put('/profile', (req, res) => {
  // In a real implementation, validate and update the profile
  const updatedProfile = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(updatedProfile);
});

// GET /goals - Get user goals
router.get('/goals', (req, res) => {
  res.json({
    dailyCalories: 2000,
    dailyProteinGrams: 150,
    dailyCarbsGrams: 200,
    dailyFatGrams: 65,
    dailyWaterLiters: 2.5,
    targetWeightKg: 70,
    weightGoalType: 'lose',
    updatedAt: '2025-08-30T10:00:00Z',
  });
});

// PUT /goals - Update user goals
router.put('/goals', (req, res) => {
  // In a real implementation, validate and update the goals
  const updatedGoals = {
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(updatedGoals);
});

export default router;
