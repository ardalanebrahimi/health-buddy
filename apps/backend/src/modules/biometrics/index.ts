import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import {
  logWeight,
  getLatestWeight,
  getWeightEntries,
  logWaist,
  getLatestWaist,
  getWaistEntries,
  logBP,
  getRecentBP,
  logHR,
  getRecentHR,
  logPain,
  getLatestPain,
  getRecentPain,
  logMood,
  getLatestMood,
  logEnergy,
  getLatestEnergy,
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

// GET /biometrics/bp/recent - Get recent blood pressure entries
router.get('/bp/recent', getRecentBP);

// POST /biometrics/bp - Log blood pressure
router.post('/bp', logBP);

// GET /biometrics/hr/recent - Get recent heart rate entries
router.get('/hr/recent', getRecentHR);

// POST /biometrics/hr - Log heart rate
router.post('/hr', logHR);

// GET /biometrics/pain/recent - Get recent pain entries
router.get('/pain/recent', getRecentPain);

// POST /biometrics/pain - Log pain
router.post('/pain', logPain);

// GET /biometrics/pain/latest - Get latest pain entry
router.get('/pain/latest', getLatestPain);

// POST /biometrics/mood - Log mood
router.post('/mood', logMood);

// GET /biometrics/mood/latest - Get latest mood entry
router.get('/mood/latest', getLatestMood);

// POST /biometrics/energy - Log energy
router.post('/energy', logEnergy);

// GET /biometrics/energy/latest - Get latest energy entry
router.get('/energy/latest', getLatestEnergy);

export default router;
