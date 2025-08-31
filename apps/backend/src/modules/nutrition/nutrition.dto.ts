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

export const UpdateMealItemDto = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  portionGrams: z.number().min(0),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
});

export type UpdateMealItemRequest = z.infer<typeof UpdateMealItemDto>;

export const UpdateMealItemsDto = z.object({
  items: z.array(UpdateMealItemDto).min(1),
});

export type UpdateMealItemsRequest = z.infer<typeof UpdateMealItemsDto>;
