import { z } from 'zod';

export const CreateMealPhotoDto = z.object({
  takenAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateMealPhotoRequest = z.infer<typeof CreateMealPhotoDto>;

export const GetMealParamsDto = z.object({
  mealId: z.string().uuid(),
});

export type GetMealParams = z.infer<typeof GetMealParamsDto>;
