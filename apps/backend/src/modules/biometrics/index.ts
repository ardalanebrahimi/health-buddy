import { Router } from 'express';
import {
  logWeight,
  getLatestWeight,
  getWeightEntries,
} from './biometrics.controller';

const router = Router();

// GET /biometrics/weight - Get weight entries
router.get('/weight', getWeightEntries);

// POST /biometrics/weight - Log weight
router.post('/weight', logWeight);

// GET /biometrics/weight/latest - Get latest weight
router.get('/weight/latest', getLatestWeight);

export default router;
