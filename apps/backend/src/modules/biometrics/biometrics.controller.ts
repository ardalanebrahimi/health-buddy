import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BiometricsService } from './biometrics.service';
import { CreateWeightRequest, CreateWaistRequest } from './biometrics.dto';

const prisma = new PrismaClient();
const biometricsService = new BiometricsService(prisma);

export const logWeight = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const data: CreateWeightRequest = req.body;

    // Validate required fields
    if (!data.valueKg) {
      return res.status(400).json({
        error: {
          code: 'MISSING_WEIGHT',
          message: 'valueKg is required',
        },
      });
    }

    // Validate weight range
    if (data.valueKg < 20 || data.valueKg > 300) {
      return res.status(400).json({
        error: {
          code: 'INVALID_WEIGHT',
          message: 'Weight must be between 20 and 300 kg',
        },
      });
    }

    const result = await biometricsService.logWeight({
      ...data,
      userId,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error logging weight:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to log weight',
      },
    });
  }
};

export const getLatestWeight = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';

    const result = await biometricsService.getLatestWeight(userId);

    if (!result) {
      return res.status(404).json({
        error: {
          code: 'NO_WEIGHT_ENTRIES',
          message: 'No weight entries found',
        },
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting latest weight:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get latest weight',
      },
    });
  }
};

export const getWeightEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const { startDate, endDate } = req.query;

    const result = await biometricsService.getWeightEntries(
      userId,
      startDate as string,
      endDate as string
    );

    res.json({
      ...result,
      startDate,
      endDate,
    });
  } catch (error) {
    console.error('Error getting weight entries:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get weight entries',
      },
    });
  }
};

export const logWaist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const data: CreateWaistRequest = req.body;

    // Validate required fields
    if (!data.valueCm) {
      return res.status(400).json({
        error: {
          code: 'MISSING_WAIST',
          message: 'valueCm is required',
        },
      });
    }

    // Validate waist circumference range
    if (data.valueCm < 40 || data.valueCm > 200) {
      return res.status(400).json({
        error: {
          code: 'INVALID_WAIST',
          message: 'Waist circumference must be between 40 and 200 cm',
        },
      });
    }

    const result = await biometricsService.logWaist({
      ...data,
      userId,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error logging waist:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to log waist circumference',
      },
    });
  }
};

export const getLatestWaist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';

    const result = await biometricsService.getLatestWaist(userId);

    if (!result) {
      return res.status(404).json({
        error: {
          code: 'NO_WAIST_ENTRIES',
          message: 'No waist circumference entries found',
        },
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting latest waist:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get latest waist circumference',
      },
    });
  }
};

export const getWaistEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const { startDate, endDate } = req.query;

    const result = await biometricsService.getWaistEntries(
      userId,
      startDate as string,
      endDate as string
    );

    res.json({
      ...result,
      startDate,
      endDate,
    });
  } catch (error) {
    console.error('Error getting waist entries:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get waist circumference entries',
      },
    });
  }
};
