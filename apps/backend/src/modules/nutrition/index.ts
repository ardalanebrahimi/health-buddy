import { Router } from 'express';

const router = Router();

// GET /meals - Get meals
router.get('/meals', (req, res) => {
  const { date, limit = 20 } = req.query;

  res.json({
    meals: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Grilled Chicken Salad',
        type: 'lunch',
        takenAt: '2025-08-30T12:30:00Z',
        status: 'final',
        totalCalories: 450,
        totalProteinGrams: 35,
        totalCarbsGrams: 15,
        totalFatGrams: 20,
        photoUrl: 'https://example.com/photos/meal-123.jpg',
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Grilled Chicken Breast',
            quantity: 150,
            unit: 'grams',
            calories: 165,
            proteinGrams: 31,
            carbsGrams: 0,
            fatGrams: 3.6,
            confidence: 0.95,
          },
        ],
        createdAt: '2025-08-30T12:30:00Z',
        updatedAt: '2025-08-30T12:30:00Z',
      },
    ],
    total: 1,
    pagination: {
      limit: parseInt(limit as string),
      offset: 0,
      hasNext: false,
      hasPrevious: false,
    },
  });
});

// POST /meals - Create meal
router.post('/meals', (req, res) => {
  const newMeal = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    ...req.body,
    status: 'draft',
    totalCalories: 0,
    totalProteinGrams: 0,
    totalCarbsGrams: 0,
    totalFatGrams: 0,
    items: req.body.items || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  res.status(201).json(newMeal);
});

// POST /meals/photo - Upload meal photo (stub implementation)
router.post('/meals/photo', (req, res) => {
  // TODO: Implement file upload with multer
  res.json({
    photoId: '123e4567-e89b-12d3-a456-426614174003',
    photoUrl: 'https://example.com/photos/example-meal.jpg',
    status: 'uploaded',
  });
});

// POST /meals/:mealId/recognize - Recognize meal from photo
router.post('/meals/:mealId/recognize', (req, res) => {
  const { mealId } = req.params;

  res.json({
    mealId,
    recognizedItems: [
      {
        id: '123e4567-e89b-12d3-a456-426614174004',
        name: 'Grilled Chicken Breast',
        quantity: 150,
        unit: 'grams',
        calories: 165,
        proteinGrams: 31,
        carbsGrams: 0,
        fatGrams: 3.6,
        confidence: 0.95,
      },
    ],
    confidence: 0.85,
    status: 'completed',
    totalCalories: 165,
  });
});

// GET /nutrition/summary - Get nutrition summary
router.get('/summary', (req, res) => {
  const { date = '2025-08-30', period = 'daily' } = req.query;

  res.json({
    date,
    period,
    totalCalories: 1850,
    totalProteinGrams: 120,
    totalCarbsGrams: 180,
    totalFatGrams: 65,
    goalCalories: 2000,
    goalProteinGrams: 150,
    goalCarbsGrams: 200,
    goalFatGrams: 65,
    mealBreakdown: [
      {
        type: 'breakfast',
        calories: 400,
        mealCount: 1,
      },
      {
        type: 'lunch',
        calories: 450,
        mealCount: 1,
      },
      {
        type: 'dinner',
        calories: 600,
        mealCount: 1,
      },
      {
        type: 'snack',
        calories: 400,
        mealCount: 2,
      },
    ],
  });
});

export default router;
