import { Router } from 'express';
import {
  uploadMealPhoto,
  getMealById,
  recognizeMeal,
  updateMealItems,
} from './nutrition.controller';

const router: Router = Router();

// POST /meals/photo - Upload meal photo
router.post('/meals/photo', ...uploadMealPhoto);

// GET /meals/:mealId - Get meal by ID
router.get('/meals/:mealId', getMealById);

// POST /meals/:mealId/recognize - Recognize meal from photo
router.post('/meals/:mealId/recognize', recognizeMeal);

// PATCH /meals/:mealId/items - Update meal items
router.patch('/meals/:mealId/items', updateMealItems);

export default router;
