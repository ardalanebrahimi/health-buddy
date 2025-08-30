import { Router } from 'express';

const router = Router();

// GET /daily-summary - Get daily summary
router.get('/daily-summary', (req, res) => {
  const { date = '2025-08-30' } = req.query;

  res.json({
    date,
    nutrition: {
      date,
      period: 'daily',
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
    },
    hydration: {
      totalMl: 1500,
      goalMl: 2500,
      percentage: 60,
    },
    weight: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      weightKg: 72.5,
      takenAt: '2025-08-30T07:00:00Z',
      notes: 'Morning weight after workout',
      createdAt: '2025-08-30T07:00:00Z',
      trend: 'decreasing',
    },
    completionScore: 85,
  });
});

export default router;
