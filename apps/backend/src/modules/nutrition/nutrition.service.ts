import { PrismaClient, MealStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { MockAIVisionService } from './ai-vision.service';

interface CreateMealPhotoData {
  takenAt?: string;
  notes?: string;
  userId: string;
}

interface FileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

// NU-004: Manual meal creation interfaces
interface CreateMealData {
  takenAt: string;
  items: { name: string; portionGrams: number }[];
  userId: string;
}

interface FoodSearchItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: string;
}

export class NutritionService {
  private aiVisionService: MockAIVisionService;

  constructor(private prisma: PrismaClient) {
    this.aiVisionService = new MockAIVisionService();
  }

  async createMealWithPhoto(
    file: FileUpload,
    data: CreateMealPhotoData
  ): Promise<{
    mealId: string;
    photoUrl: string;
    status: MealStatus;
    createdAt: Date;
  }> {
    // Validate file
    this.validateFile(file);

    // Process image (convert HEIC to JPEG, compress)
    const processedBuffer = await this.processImage(file);

    // Generate unique filename
    const fileExtension = this.getFileExtension(file.mimetype);
    const filename = `meal-${uuidv4()}.${fileExtension}`;

    // Store file (for dev, use local uploads directory)
    const photoUrl = await this.storeFile(processedBuffer, filename);

    // Get image dimensions and EXIF data
    const metadata = await sharp(processedBuffer).metadata();

    // Create meal and photo records in database
    const meal = await this.prisma.meal.create({
      data: {
        id: uuidv4(),
        userId: data.userId,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
        status: MealStatus.draft,
        notes: data.notes,
        photo: {
          create: {
            photoUrl,
            width: metadata.width,
            height: metadata.height,
            exifJson: metadata.exif
              ? JSON.parse(JSON.stringify(metadata.exif))
              : null,
          },
        },
      },
      include: {
        photo: true,
      },
    });

    return {
      mealId: meal.id,
      photoUrl: meal.photo!.photoUrl,
      status: meal.status,
      createdAt: meal.createdAt,
    };
  }

  async getMealById(mealId: string, userId: string) {
    const meal = await this.prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
      include: {
        photo: true,
        items: true,
      },
    });

    if (!meal) {
      return null;
    }

    return {
      id: meal.id,
      name: meal.items.length > 0 ? meal.items[0].name : 'Meal',
      type: this.inferMealType(meal.takenAt || meal.createdAt),
      takenAt: meal.takenAt?.toISOString() || meal.createdAt.toISOString(),
      status: meal.status,
      totalCalories: meal.items.reduce(
        (sum, item) => sum + (item.calories || 0),
        0
      ),
      totalProteinGrams: meal.items.reduce(
        (sum, item) => sum + (item.protein || 0),
        0
      ),
      totalCarbsGrams: meal.items.reduce(
        (sum, item) => sum + (item.carbs || 0),
        0
      ),
      totalFatGrams: meal.items.reduce((sum, item) => sum + (item.fat || 0), 0),
      photoUrl: meal.photo?.photoUrl,
      items: meal.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.portionGrams || 0,
        unit: 'grams',
        calories: item.calories || 0,
        proteinGrams: item.protein || 0,
        carbsGrams: item.carbs || 0,
        fatGrams: item.fat || 0,
        confidence: item.confidence,
      })),
      createdAt: meal.createdAt.toISOString(),
      updatedAt: meal.updatedAt.toISOString(),
    };
  }

  async recognizeMeal(mealId: string, userId: string) {
    // First, verify the meal exists and belongs to the user
    const meal = await this.prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
      include: {
        photo: true,
      },
    });

    if (!meal) {
      throw new Error('MEAL_NOT_FOUND');
    }

    if (!meal.photo) {
      throw new Error('PHOTO_NOT_FOUND');
    }

    try {
      // Call AI vision service to analyze the photo
      const aiResponse = await this.aiVisionService.analyzeFoodPhoto(
        meal.photo.photoUrl
      );

      // If no items recognized, return fallback response
      if (aiResponse.items.length === 0) {
        return {
          mealId,
          status: 'failed',
          recognizedItems: [],
          confidence: 0,
          totalCalories: 0,
        };
      }

      // Save recognized items to database
      const mealItems = await this.prisma.$transaction(async (tx) => {
        // Delete any existing items for this meal
        await tx.mealItem.deleteMany({
          where: { mealId },
        });

        // Insert new recognized items
        const items = await Promise.all(
          aiResponse.items.map((item) =>
            tx.mealItem.create({
              data: {
                id: uuidv4(),
                mealId,
                name: item.name,
                portionGrams: item.portionGrams,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fat: item.fat,
                confidence: item.confidence,
                editedByUser: false,
              },
            })
          )
        );

        // Update meal status to recognized
        await tx.meal.update({
          where: { id: mealId },
          data: { status: MealStatus.recognized },
        });

        return items;
      });

      // Transform to API response format
      const recognizedItems = mealItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.portionGrams || 0,
        unit: 'grams',
        calories: item.calories || 0,
        proteinGrams: item.protein || 0,
        carbsGrams: item.carbs || 0,
        fatGrams: item.fat || 0,
        confidence: item.confidence || 0,
      }));

      const totalCalories = recognizedItems.reduce(
        (sum, item) => sum + item.calories,
        0
      );

      return {
        mealId,
        status: 'completed',
        recognizedItems,
        confidence: aiResponse.overallConfidence,
        totalCalories,
      };
    } catch (error) {
      console.error('AI vision service failed:', error);
      throw new Error('RECOGNITION_FAILED');
    }
  }

  async updateItems(
    mealId: string,
    userId: string,
    items: Array<{
      id: string;
      name: string;
      portionGrams: number;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    }>
  ): Promise<{
    mealId: string;
    status: string;
    totals: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }> {
    // Verify meal exists and belongs to user
    const meal = await this.prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
    });

    if (!meal) {
      throw new Error('MEAL_NOT_FOUND');
    }

    // Update items in transaction and calculate totals
    const result = await this.prisma.$transaction(async (tx) => {
      const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      // Update each item
      for (const item of items) {
        await tx.mealItem.update({
          where: { id: item.id },
          data: {
            name: item.name,
            portionGrams: item.portionGrams,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            editedByUser: true,
          },
        });

        // Add to totals
        totals.calories += item.calories ?? 0;
        totals.protein += item.protein ?? 0;
        totals.carbs += item.carbs ?? 0;
        totals.fat += item.fat ?? 0;
      }

      // Update meal: status=final, edited=true, totalsJson
      await tx.meal.update({
        where: { id: mealId },
        data: {
          status: MealStatus.final,
          edited: true,
          totalsJson: totals,
        },
      });

      return totals;
    });

    return {
      mealId,
      status: 'final',
      totals: result,
    };
  }

  private validateFile(file: FileUpload): void {
    // Check file size (8MB limit)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      throw new Error('FILE_TOO_LARGE');
    }

    // Check MIME type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/heif',
    ];
    if (!allowedTypes.includes(file.mimetype.toLowerCase())) {
      throw new Error('UNSUPPORTED_FILE_TYPE');
    }
  }

  private async processImage(file: FileUpload): Promise<Buffer> {
    let buffer = file.buffer;

    // Convert HEIC to JPEG if needed
    if (
      file.mimetype.toLowerCase().includes('heic') ||
      file.mimetype.toLowerCase().includes('heif')
    ) {
      // Note: heic-convert would be used here
      // For now, we'll throw an error as HEIC conversion requires special handling
      throw new Error('HEIC_CONVERSION_NOT_IMPLEMENTED');
    }

    // Compress and resize image
    try {
      buffer = await sharp(buffer)
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch (error) {
      throw new Error('IMAGE_PROCESSING_FAILED');
    }

    return buffer;
  }

  private getFileExtension(mimetype: string): string {
    switch (mimetype.toLowerCase()) {
      case 'image/jpeg':
      case 'image/jpg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/heic':
      case 'image/heif':
        return 'jpg'; // Convert to JPG
      default:
        return 'jpg';
    }
  }

  private async storeFile(buffer: Buffer, filename: string): Promise<string> {
    // For development, store in local uploads directory
    const uploadsDir = path.join(__dirname, '../../../../uploads');

    // Ensure uploads directory exists
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return URL (in production, this would be S3/GCS URL)
    return `http://localhost:3000/uploads/${filename}`;
  }

  private inferMealType(date: Date): string {
    const hour = date.getHours();

    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snack';
  }

  // NU-004: Search foods in nutrition database
  async searchFoods(
    query: string,
    limit: number = 10
  ): Promise<{ foods: FoodSearchItem[]; total: number }> {
    // For now, return mock data (in production, this would call USDA/FatSecret API)
    const mockFoods: FoodSearchItem[] = [
      {
        name: 'Chicken breast, skinless, boneless',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        source: 'USDA',
      },
      {
        name: 'Rice, white, long-grain, cooked',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        source: 'USDA',
      },
      {
        name: 'Broccoli, raw',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
        source: 'USDA',
      },
      {
        name: 'Oatmeal, cooked with water',
        calories: 68,
        protein: 2.4,
        carbs: 12,
        fat: 1.4,
        source: 'USDA',
      },
      {
        name: 'Greek yogurt, plain, low-fat',
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        source: 'USDA',
      },
    ];

    // Filter based on query
    const filtered = mockFoods.filter((food) =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );

    return {
      foods: filtered.slice(0, limit),
      total: filtered.length,
    };
  }

  // NU-004: Create manual meal entry
  async createManualMeal(data: CreateMealData): Promise<{
    mealId: string;
    status: MealStatus;
    totals: {
      totalCalories: number;
      totalProteinGrams: number;
      totalCarbsGrams: number;
      totalFatGrams: number;
    };
  }> {
    // Calculate nutrition for each item by looking up food data
    const itemsWithNutrition = await Promise.all(
      data.items.map(async (item) => {
        const foodData = await this.lookupFoodNutrition(item.name);
        
        // Calculate nutrition based on portion
        const portionFactor = item.portionGrams / 100; // nutrition is per 100g
        
        return {
          id: uuidv4(),
          name: item.name,
          portionGrams: item.portionGrams,
          calories: Math.round(foodData.calories * portionFactor),
          protein: Math.round(foodData.protein * portionFactor * 10) / 10,
          carbs: Math.round(foodData.carbs * portionFactor * 10) / 10,
          fat: Math.round(foodData.fat * portionFactor * 10) / 10,
          confidence: null,
          editedByUser: false,
        };
      })
    );

    // Calculate totals
    const totals = {
      totalCalories: itemsWithNutrition.reduce(
        (sum, item) => sum + item.calories,
        0
      ),
      totalProteinGrams: itemsWithNutrition.reduce(
        (sum, item) => sum + item.protein,
        0
      ),
      totalCarbsGrams: itemsWithNutrition.reduce(
        (sum, item) => sum + item.carbs,
        0
      ),
      totalFatGrams: itemsWithNutrition.reduce(
        (sum, item) => sum + item.fat,
        0
      ),
    };

    // Create meal and items in database
    const meal = await this.prisma.meal.create({
      data: {
        id: uuidv4(),
        userId: data.userId,
        takenAt: new Date(data.takenAt),
        status: MealStatus.final,
        totalsJson: totals,
        items: {
          create: itemsWithNutrition,
        },
      },
      include: {
        items: true,
      },
    });

    return {
      mealId: meal.id,
      status: meal.status,
      totals,
    };
  }

  // Helper method to look up food nutrition data
  private async lookupFoodNutrition(
    foodName: string
  ): Promise<{ calories: number; protein: number; carbs: number; fat: number }> {
    // For now, use the same mock data as search
    // In production, this would call a nutrition API or local database
    const mockFoods = [
      {
        name: 'chicken breast',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
      },
      {
        name: 'rice',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
      },
      {
        name: 'broccoli',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
      },
      {
        name: 'oatmeal',
        calories: 68,
        protein: 2.4,
        carbs: 12,
        fat: 1.4,
      },
      {
        name: 'greek yogurt',
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
      },
    ];

    // Find best match
    const lowerFoodName = foodName.toLowerCase();
    const bestMatch = mockFoods.find((food) =>
      lowerFoodName.includes(food.name)
    );

    // Default fallback if no match found
    if (!bestMatch) {
      return {
        calories: 100,
        protein: 5,
        carbs: 10,
        fat: 3,
      };
    }

    return {
      calories: bestMatch.calories,
      protein: bestMatch.protein,
      carbs: bestMatch.carbs,
      fat: bestMatch.fat,
    };
  }
}
