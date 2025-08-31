import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import {
  logWeight,
  getLatestWeight,
  getWeightEntries,
  logWaist,
  getLatestWaist,
  getWaistEntries,
} from './biometrics.controller';

const router: ExpressRouter = Router();

// GET /biometrics/weight - Get weight entries
router.get('/weight', getWeightEntries);

// POST /biometrics/weight - Log weight
router.post('/weight', logWeight);

// GET /biometrics/weight/latest - Get latest weight
router.get('/weight/latest', getLatestWeight);

// GET /biometrics/waist - Get waist entries
router.get('/waist', getWaistEntries);

// POST /biometrics/waist - Log waist circumference
router.post('/waist', logWaist);

// GET /biometrics/waist/latest - Get latest waist circumference
router.get('/waist/latest', getLatestWaist);

export default router;
