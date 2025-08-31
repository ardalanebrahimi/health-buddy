// Mock AI Vision Service for food recognition
// In production, this would call OpenAI Vision API or similar service

export interface RecognizedFoodItem {
  name: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export interface AIVisionResponse {
  items: RecognizedFoodItem[];
  overallConfidence: number;
}

export class MockAIVisionService {
  async analyzeFoodPhoto(photoUrl: string): Promise<AIVisionResponse> {
    // Simulate API latency
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Mock responses based on the photo URL or random generation
    const mockItems = this.generateMockFoodItems();

    return {
      items: mockItems,
      overallConfidence:
        mockItems.length > 0
          ? mockItems.reduce((sum, item) => sum + item.confidence, 0) /
            mockItems.length
          : 0,
    };
  }

  private generateMockFoodItems(): RecognizedFoodItem[] {
    const mockFoods = [
      {
        name: 'Spaghetti Bolognese',
        portionGrams: 250,
        calories: 410,
        protein: 18,
        carbs: 55,
        fat: 12,
        confidence: 0.82,
      },
      {
        name: 'Mixed Green Salad',
        portionGrams: 120,
        calories: 45,
        protein: 3,
        carbs: 8,
        fat: 1,
        confidence: 0.75,
      },
      {
        name: 'Grilled Chicken Breast',
        portionGrams: 150,
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        confidence: 0.95,
      },
      {
        name: 'Rice Bowl',
        portionGrams: 200,
        calories: 280,
        protein: 6,
        carbs: 58,
        fat: 1,
        confidence: 0.88,
      },
      {
        name: 'Apple',
        portionGrams: 180,
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        confidence: 0.92,
      },
    ];

    // Randomly select 1-3 items to simulate varied recognition results
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];

    for (let i = 0; i < numItems; i++) {
      const randomIndex = Math.floor(Math.random() * mockFoods.length);
      selectedItems.push(mockFoods[randomIndex]);
    }

    // Sometimes return empty array to test fallback behavior
    if (Math.random() < 0.1) {
      return [];
    }

    return selectedItems;
  }
}
