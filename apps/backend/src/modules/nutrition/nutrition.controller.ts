import { Request, Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { NutritionService } from './nutrition.service';
import {
  CreateMealPhotoDto,
  GetMealParamsDto,
  UpdateMealItemsDto,
} from './nutrition.dto';

const prisma = new PrismaClient();
const nutritionService = new NutritionService(prisma);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/heif',
    ];
    if (allowedTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('UNSUPPORTED_FILE_TYPE'));
    }
  },
});

export const uploadMealPhoto: RequestHandler[] = [
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          error: {
            code: 'MISSING_FILE',
            message: 'Image is required',
          },
        });
      }

      // Validate request body
      const validation = CreateMealPhotoDto.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.error.errors,
          },
        });
      }

      // For now, use a hardcoded user ID (single-user mode)
      const userId = 'default-user';

      const result = await nutritionService.createMealWithPhoto(req.file, {
        ...validation.data,
        userId,
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error uploading meal photo:', error);

      if (error.message === 'FILE_TOO_LARGE') {
        return res.status(413).json({
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size exceeds 8MB limit',
          },
        });
      }

      if (error.message === 'UNSUPPORTED_FILE_TYPE') {
        return res.status(415).json({
          error: {
            code: 'UNSUPPORTED_FILE_TYPE',
            message:
              'File type not supported. Please use JPG, PNG, or HEIC format',
          },
        });
      }

      if (error.message === 'HEIC_CONVERSION_NOT_IMPLEMENTED') {
        return res.status(415).json({
          error: {
            code: 'HEIC_NOT_SUPPORTED',
            message: 'HEIC format not yet supported. Please use JPG or PNG',
          },
        });
      }

      if (error.message === 'IMAGE_PROCESSING_FAILED') {
        return res.status(400).json({
          error: {
            code: 'IMAGE_PROCESSING_FAILED',
            message:
              'Failed to process image. Please ensure the file is a valid image',
          },
        });
      }

      // Generic server error
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  },
];

export const getMealById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate parameters
    const validation = GetMealParamsDto.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid meal ID',
          details: validation.error.errors,
        },
      });
    }

    // For now, use a hardcoded user ID (single-user mode)
    const userId = 'default-user';
    const { mealId } = validation.data;

    const meal = await nutritionService.getMealById(mealId, userId);

    if (!meal) {
      return res.status(404).json({
        error: {
          code: 'MEAL_NOT_FOUND',
          message: 'Meal not found',
        },
      });
    }

    res.json(meal);
  } catch (error: any) {
    console.error('Error getting meal:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
};

export const recognizeMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { mealId } = req.params;

  console.log(`meal_recognition_started ${mealId}`);

  try {
    // Validate parameters
    const validation = GetMealParamsDto.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid meal ID',
          details: validation.error.errors,
        },
      });
    }

    // For now, use a hardcoded user ID (single-user mode)
    const userId = 'default-user';

    const result = await nutritionService.recognizeMeal(mealId, userId);

    console.log(`meal_recognition_completed ${mealId}`);

    res.json(result);
  } catch (error: any) {
    console.error(`meal_recognition_failed ${mealId}`, error);

    if (error.message === 'MEAL_NOT_FOUND') {
      return res.status(404).json({
        error: {
          code: 'MEAL_NOT_FOUND',
          message: 'Meal not found',
        },
      });
    }

    if (error.message === 'PHOTO_NOT_FOUND') {
      return res.status(422).json({
        error: {
          code: 'PHOTO_NOT_FOUND',
          message: 'No photo found for this meal',
        },
      });
    }

    if (error.message === 'RECOGNITION_FAILED') {
      // Return graceful fallback as per spec
      return res.json({
        mealId,
        status: 'failed',
        recognizedItems: [],
        confidence: 0,
        totalCalories: 0,
        message: "Couldn't recognize meal, please edit manually.",
      });
    }

    // Generic server error
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
};

export const updateMealItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate parameters
    const paramValidation = GetMealParamsDto.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid meal ID',
          details: paramValidation.error.errors,
        },
      });
    }

    // Validate request body
    const bodyValidation = UpdateMealItemsDto.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: bodyValidation.error.errors,
        },
      });
    }

    // For now, use a hardcoded user ID (single-user mode)
    const userId = 'default-user';
    const { mealId } = paramValidation.data;
    const { items } = bodyValidation.data;

    const result = await nutritionService.updateItems(mealId, userId, items);

    res.json(result);
  } catch (error: any) {
    console.error('Error updating meal items:', error);

    if (error.message === 'MEAL_NOT_FOUND') {
      return res.status(404).json({
        error: {
          code: 'MEAL_NOT_FOUND',
          message: 'Meal not found',
        },
      });
    }

    // Generic server error
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
};
