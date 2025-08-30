import { Router } from 'express';
import { ProfileService } from './profile.service';
import { GoalsService } from './goals.service';
import {
  validateCreateProfile,
  validateUpdateBaseline,
} from './profile.validation';
import { validateUpdateGoals } from './goals.validation';

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

// PATCH /profile/baseline - Update user baseline health information
router.patch('/profile/baseline', async (req, res) => {
  try {
    // Validate request body
    const validationResult = validateUpdateBaseline(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input provided',
          details: validationResult.errors,
        },
      });
    }

    const profile = await ProfileService.updateBaseline(
      'single-user-v1',
      req.body
    );
    res.json(profile);
  } catch (error) {
    console.error('Error updating baseline:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update baseline',
      },
    });
  }
});

// GET /goals - Get user goals
router.get('/goals', async (req, res) => {
  try {
    const goals = await GoalsService.getGoals();

    if (!goals) {
      return res.status(404).json({
        error: {
          code: 'GOALS_NOT_FOUND',
          message: 'Goals not found',
        },
      });
    }

    res.json(goals);
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve goals',
      },
    });
  }
});

// PUT /goals - Update user goals
router.put('/goals', async (req, res) => {
  try {
    // Validate request body
    const validationResult = validateUpdateGoals(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input provided',
          details: validationResult.errors,
        },
      });
    }

    const updatedGoals = await GoalsService.updateGoals(req.body);
    res.json(updatedGoals);
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update goals',
      },
    });
  }
});

export default router;
