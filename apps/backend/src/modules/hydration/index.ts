import { Router } from 'express';

const router = Router();

// GET /hydration - Get hydration entries
router.get('/', (req, res) => {
  const { date = '2025-08-30' } = req.query;

  res.json({
    entries: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        amountMl: 250,
        type: 'water',
        takenAt: '2025-08-30T08:00:00Z',
        createdAt: '2025-08-30T08:00:00Z',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        amountMl: 300,
        type: 'water',
        takenAt: '2025-08-30T12:00:00Z',
        createdAt: '2025-08-30T12:00:00Z',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        amountMl: 200,
        type: 'tea',
        takenAt: '2025-08-30T15:00:00Z',
        createdAt: '2025-08-30T15:00:00Z',
      },
    ],
    totalMl: 750,
    goalMl: 2500,
    date,
  });
});

// POST /hydration - Log hydration
router.post('/', (req, res) => {
  const newHydrationEntry = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(newHydrationEntry);
});

export default router;
