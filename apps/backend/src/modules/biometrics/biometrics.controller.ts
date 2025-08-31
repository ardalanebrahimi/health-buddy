import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BiometricsService } from './biometrics.service';
import {
  CreateWeightRequest,
  CreateWaistRequest,
  CreateBPRequest,
  CreateHRRequest,
} from './biometrics.dto';

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

// Blood Pressure Controllers
export const logBP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const data: CreateBPRequest = req.body;

    // Validate required fields
    if (!data.systolic || !data.diastolic || !data.pulse) {
      return res.status(400).json({
        error: {
          code: 'MISSING_BP_DATA',
          message: 'systolic, diastolic, and pulse are required',
        },
      });
    }

    // Validate ranges
    if (data.systolic < 80 || data.systolic > 200) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SYSTOLIC',
          message: 'Systolic pressure must be between 80 and 200 mmHg',
        },
      });
    }

    if (data.diastolic < 50 || data.diastolic > 120) {
      return res.status(400).json({
        error: {
          code: 'INVALID_DIASTOLIC',
          message: 'Diastolic pressure must be between 50 and 120 mmHg',
        },
      });
    }

    if (data.pulse < 40 || data.pulse > 180) {
      return res.status(400).json({
        error: {
          code: 'INVALID_PULSE',
          message: 'Pulse must be between 40 and 180 bpm',
        },
      });
    }

    const result = await biometricsService.logBP({
      ...data,
      userId,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error logging blood pressure:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to log blood pressure',
      },
    });
  }
};

export const getRecentBP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const limit = parseInt(req.query.limit as string) || 10;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 100',
        },
      });
    }

    const result = await biometricsService.getRecentBP(userId, limit);
    res.json(result);
  } catch (error) {
    console.error('Error getting recent blood pressure:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get recent blood pressure entries',
      },
    });
  }
};

// Heart Rate Controllers
export const logHR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const data: CreateHRRequest = req.body;

    // Validate required fields
    if (!data.bpm) {
      return res.status(400).json({
        error: {
          code: 'MISSING_BPM',
          message: 'bpm is required',
        },
      });
    }

    // Validate range
    if (data.bpm < 30 || data.bpm > 200) {
      return res.status(400).json({
        error: {
          code: 'INVALID_BPM',
          message: 'Heart rate must be between 30 and 200 bpm',
        },
      });
    }

    const result = await biometricsService.logHR({
      ...data,
      userId,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error logging heart rate:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to log heart rate',
      },
    });
  }
};

export const getRecentHR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 'default-user';
    const limit = parseInt(req.query.limit as string) || 10;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 100',
        },
      });
    }

    const result = await biometricsService.getRecentHR(userId, limit);
    res.json(result);
  } catch (error) {
    console.error('Error getting recent heart rate:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get recent heart rate entries',
      },
    });
  }
};
