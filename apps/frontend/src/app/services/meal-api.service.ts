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
  quantity: number;
  unit: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  confidence?: number;
}

export interface MealRecognitionResponse {
  mealId: string;
  status: "completed" | "failed" | "processing";
  recognizedItems: FoodItem[];
  confidence: number;
  totalCalories: number;
  message?: string;
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
      .post<MealPhotoResponse>(`${this.baseUrl}/meals/photo`, formData)
      .pipe(catchError(this.handleError));
  }

  getMealById(mealId: string): Observable<Meal> {
    return this.http
      .get<Meal>(`${this.baseUrl}/meals/${mealId}`)
      .pipe(catchError(this.handleError));
  }

  recognizeMeal(mealId: string): Observable<MealRecognitionResponse> {
    return this.http
      .post<MealRecognitionResponse>(
        `${this.baseUrl}/meals/${mealId}/recognize`,
        {}
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
