import { Router } from 'express';
import { uploadMealPhoto, getMealById } from './nutrition.controller';

const router: Router = Router();

// POST /meals/photo - Upload meal photo
router.post('/meals/photo', ...uploadMealPhoto);

// GET /meals/:mealId - Get meal by ID
router.get('/meals/:mealId', getMealById);

export default router;
