import { Router, IRouter } from 'express';
import {
  createHydration,
  getHydrationSummary,
  getHydrationEntries,
  deleteHydration,
} from './hydration.controller';

const router: IRouter = Router();

// GET /hydration - Get hydration entries
router.get('/', getHydrationEntries);

// POST /hydration - Log hydration
router.post('/', createHydration);

// GET /hydration/summary - Get hydration summary
router.get('/summary', getHydrationSummary);

// DELETE /hydration/:id - Delete hydration entry (for undo functionality)
router.delete('/:id', deleteHydration);

export default router;
