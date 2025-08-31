import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HydrationService } from './hydration.service';
import {
  validateCreateHydrationDto,
  validateGetHydrationSummaryDto,
  validateGetHydrationEntriesDto,
} from './hydration.dto';

const prisma = new PrismaClient();
const hydrationService = new HydrationService(prisma);

export const createHydration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, using a mock user ID since auth is not fully implemented
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const dto = validateCreateHydrationDto(req.body);

    const hydrationEntry = await hydrationService.createHydration(userId, {
      amountMl: dto.amountMl,
      takenAt: new Date(dto.takenAt),
    });

    res.status(201).json({
      id: hydrationEntry.id,
      amountMl: hydrationEntry.amountMl,
      type: 'water',
      takenAt: hydrationEntry.takenAt.toISOString(),
      createdAt: hydrationEntry.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      });
    }
    next(error);
  }
};

export const getHydrationSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, using a mock user ID since auth is not fully implemented
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const dto = validateGetHydrationSummaryDto(req.query);

    const summary = await hydrationService.getHydrationSummary(userId, dto.date);

    res.json(summary);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      });
    }
    next(error);
  }
};

export const getHydrationEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, using a mock user ID since auth is not fully implemented
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const dto = validateGetHydrationEntriesDto(req.query);

    const result = await hydrationService.getHydrationEntries(userId, dto.date);

    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      });
    }
    next(error);
  }
};

export const deleteHydration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, using a mock user ID since auth is not fully implemented
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Hydration entry ID is required',
        },
      });
    }

    await hydrationService.deleteHydration(userId, id);

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'Hydration entry not found') {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Hydration entry not found',
        },
      });
    }
    next(error);
  }
};
