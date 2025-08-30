import { Router } from 'express';

const router = Router();

// GET /biometrics/weight - Get weight entries
router.get('/weight', (req, res) => {
  const { startDate, endDate } = req.query;

  res.json({
    entries: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        weightKg: 72.5,
        takenAt: '2025-08-30T07:00:00Z',
        notes: 'Morning weight after workout',
        createdAt: '2025-08-30T07:00:00Z',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        weightKg: 72.8,
        takenAt: '2025-08-29T07:00:00Z',
        notes: 'Morning weight',
        createdAt: '2025-08-29T07:00:00Z',
      },
    ],
    total: 2,
    startDate,
    endDate,
  });
});

// POST /biometrics/weight - Log weight
router.post('/weight', (req, res) => {
  const newWeightEntry = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(newWeightEntry);
});

// GET /biometrics/weight/latest - Get latest weight
router.get('/weight/latest', (req, res) => {
  res.json({
    id: '123e4567-e89b-12d3-a456-426614174000',
    weightKg: 72.5,
    takenAt: '2025-08-30T07:00:00Z',
    notes: 'Morning weight after workout',
    createdAt: '2025-08-30T07:00:00Z',
  });
});

export default router;
