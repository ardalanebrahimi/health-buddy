import { Router } from 'express';
import {
  uploadMealPhoto,
  getMealById,
  recognizeMeal,
} from './nutrition.controller';

const router: Router = Router();

// POST /meals/photo - Upload meal photo
router.post('/meals/photo', ...uploadMealPhoto);

// GET /meals/:mealId - Get meal by ID
router.get('/meals/:mealId', getMealById);

// POST /meals/:mealId/recognize - Recognize meal from photo
router.post('/meals/:mealId/recognize', recognizeMeal);

export default router;
