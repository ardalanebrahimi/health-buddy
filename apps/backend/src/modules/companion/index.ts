import { Router } from 'express';

const router = Router();

// GET /companion/daily - Get daily companion message
router.get('/daily', (req, res) => {
  const { date = '2025-08-30' } = req.query;

  res.json({
    id: '123e4567-e89b-12d3-a456-426614174000',
    type: 'daily_summary',
    message:
      'Great job staying on track with your nutrition goals today! You consumed 1,850 calories and hit 80% of your protein target. Consider drinking a bit more water to reach your hydration goal.',
    tone: 'encouraging',
    date,
    createdAt: '2025-08-30T20:00:00Z',
    metadata: {
      nutritionScore: 85,
      hydrationScore: 60,
      keyInsights: [
        'High protein intake',
        'Need more hydration',
        'Good calorie control',
      ],
    },
  });
});

// GET /companion/history - Get companion message history
router.get('/history', (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  res.json({
    messages: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'daily_summary',
        message: 'Great job staying on track with your nutrition goals today!',
        tone: 'encouraging',
        date: '2025-08-30',
        createdAt: '2025-08-30T20:00:00Z',
        metadata: {
          nutritionScore: 85,
          hydrationScore: 60,
          keyInsights: ['High protein intake', 'Need more hydration'],
        },
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        type: 'encouragement',
        message:
          "You're doing great with your weight loss journey! Keep it up!",
        tone: 'motivational',
        date: '2025-08-29',
        createdAt: '2025-08-29T20:00:00Z',
        metadata: {
          nutritionScore: 78,
          hydrationScore: 80,
          keyInsights: ['Consistent logging', 'Good hydration'],
        },
      },
    ],
    total: 2,
    pagination: {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      hasNext: false,
      hasPrevious: false,
    },
  });
});

export default router;
