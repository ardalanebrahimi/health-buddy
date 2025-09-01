import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, from, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../environments/environment";

export interface MealPhotoResponse {
  mealId: string;
  photoUrl: string;
  status: "draft";
  createdAt: string;
}

export interface Meal {
  id: string;
  name: string;
  type: string;
  takenAt: string;
  status: string;
  totalCalories: number;
  totalProteinGrams: number;
  totalCarbsGrams: number;
  totalFatGrams: number;
  photoUrl?: string;
  items: FoodItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: number;
  editedByUser?: boolean;
}

// NU-006: Daily nutrition summary interfaces
export interface NutritionSummary {
  date: string;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    waterLiters: number;
  };
  meals: NutritionSummaryMeal[];
}

export interface NutritionSummaryMeal {
  mealId: string;
  takenAt: string;
  calories: number;
  status: "draft" | "recognized" | "final";
  thumbnailUrl?: string;
}

export interface MealRecognitionResponse {
  mealId: string;
  status: "completed" | "failed" | "processing";
  recognizedItems: FoodItem[];
  confidence: number;
  totalCalories: number;
  message?: string;
}

// NU-004: Additional interfaces for manual meal entry
export interface FoodSearchItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: string;
}

export interface FoodSearchResponse {
  foods: FoodSearchItem[];
  total: number;
}

export interface CreateMealRequest {
  takenAt: string;
  items: { name: string; portionGrams: number }[];
}

export interface CreateMealResponse {
  mealId: string;
  status: "final";
  totals: {
    totalCalories: number;
    totalProteinGrams: number;
    totalCarbsGrams: number;
    totalFatGrams: number;
  };
}

export interface UpdateMealItemRequest {
  id: string;
  name: string;
  portionGrams: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface UpdateMealItemsRequest {
  items: UpdateMealItemRequest[];
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UpdateMealItemsResponse {
  mealId: string;
  status: string;
  totals: MealTotals;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

@Injectable({
  providedIn: "root",
})
export class MealApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  uploadMealPhoto(
    imageBlob: Blob,
    takenAt?: string,
    notes?: string
  ): Observable<MealPhotoResponse> {
    const formData = new FormData();
    formData.append("image", imageBlob, "meal.jpg");

    if (takenAt) {
      formData.append("takenAt", takenAt);
    }

    if (notes) {
      formData.append("notes", notes);
    }

    return this.http
      .post<MealPhotoResponse>(
        `${this.baseUrl}/nutrition/meals/photo`,
        formData
      )
      .pipe(catchError(this.handleError));
  }

  getMealById(mealId: string): Observable<Meal> {
    return this.http
      .get<Meal>(`${this.baseUrl}/nutrition/meals/${mealId}`)
      .pipe(catchError(this.handleError));
  }

  recognizeMeal(mealId: string): Observable<MealRecognitionResponse> {
    return this.http
      .post<MealRecognitionResponse>(
        `${this.baseUrl}/nutrition/meals/${mealId}/recognize`,
        {}
      )
      .pipe(catchError(this.handleError));
  }

  updateMealItems(
    mealId: string,
    request: UpdateMealItemsRequest
  ): Observable<UpdateMealItemsResponse> {
    return this.http
      .patch<UpdateMealItemsResponse>(
        `${this.baseUrl}/nutrition/meals/${mealId}/items`,
        request
      )
      .pipe(catchError(this.handleError));
  }

  // Convert web path to blob for upload
  async convertWebPathToBlob(webPath: string): Promise<Blob> {
    try {
      const response = await fetch(webPath);
      return await response.blob();
    } catch (error) {
      throw new Error("Failed to convert image to blob");
    }
  }

  // NU-004: Search foods in nutrition database
  async searchFoods(
    query: string,
    limit: number = 10
  ): Promise<FoodSearchResponse> {
    const url = `${environment.apiBaseUrl}/nutrition/foods/search`;
    const params = new URLSearchParams({ q: query, limit: limit.toString() });

    return this.http
      .get<FoodSearchResponse>(`${url}?${params}`)
      .pipe(catchError(this.handleError))
      .toPromise() as Promise<FoodSearchResponse>;
  }

  // NU-004: Create manual meal entry
  async createManualMeal(
    mealData: CreateMealRequest
  ): Promise<CreateMealResponse> {
    const url = `${environment.apiBaseUrl}/nutrition/meals`;

    return this.http
      .post<CreateMealResponse>(url, mealData)
      .pipe(catchError(this.handleError))
      .toPromise() as Promise<CreateMealResponse>;
  }

  // NU-006: Get daily nutrition summary
  async getSummary(date: string): Promise<NutritionSummary> {
    const url = `${environment.apiBaseUrl}/nutrition/summary`;

    return this.http
      .get<NutritionSummary>(url, { params: { date } })
      .pipe(catchError(this.handleError))
      .toPromise() as Promise<NutritionSummary>;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error("API Error:", error);

    if (error.status === 413) {
      return throwError(() => ({
        code: "FILE_TOO_LARGE",
        message: "File size exceeds 8MB limit",
      }));
    }

    if (error.status === 415) {
      return throwError(() => ({
        code: "UNSUPPORTED_FILE_TYPE",
        message: "File type not supported. Please use JPG, PNG, or HEIC format",
      }));
    }

    if (error.status === 400 && error.error?.error) {
      return throwError(() => error.error.error);
    }

    return throwError(() => ({
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
    }));
  };
}
