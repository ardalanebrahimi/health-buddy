import { Router } from 'express';
import { ProfileService } from './profile.service';
import { validateCreateProfile } from './profile.validation';

const router = Router();

// GET /profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await ProfileService.getProfile();

    if (!profile) {
      return res.status(404).json({
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found',
        },
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve profile',
      },
    });
  }
});

// POST /profile - Create user profile
router.post('/profile', async (req, res) => {
  try {
    // Validate request body
    const validationResult = validateCreateProfile(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input provided',
          details: validationResult.errors,
        },
      });
    }

    const profile = await ProfileService.createOrUpdateProfile(req.body);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create profile',
      },
    });
  }
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
