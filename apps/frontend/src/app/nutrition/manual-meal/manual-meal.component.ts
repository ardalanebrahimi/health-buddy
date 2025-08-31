import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';

import { MealApiService } from '../../services/meal-api.service';
import { SyncService } from '../../services/sync.service';

export interface FoodSearchItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: string;
}

export interface MealItem {
  name: string;
  portionGrams: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

@Component({
  selector: 'app-manual-meal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manual-meal.component.html',
  styleUrls: ['./manual-meal.component.scss']
})
export class ManualMealComponent implements OnInit {
  // Expose Math for template use
  Math = Math;
  
  // Signals for reactive state
  items = signal<MealItem[]>([]);
  searchResults = signal<FoodSearchItem[]>([]);
  isSearching = signal(false);
  isSaving = signal(false);
  isOnline = signal(navigator.onLine);

  // Form controls
  searchForm = new FormGroup({
    query: new FormControl('', [Validators.required, Validators.minLength(1)]),
    selectedFood: new FormControl<FoodSearchItem | null>(null),
    portionGrams: new FormControl(100, [Validators.required, Validators.min(1)])
  });

  // State
  showSearchResults = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private mealApiService: MealApiService,
    private syncService: SyncService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setupNetworkListener();
    this.setupSearchListener();
  }

  // Helper methods for template calculations
  calculateCalories(food: FoodSearchItem, grams: number): number {
    return Math.round(food.calories * grams / 100);
  }

  calculateProtein(food: FoodSearchItem, grams: number): number {
    return Math.round(food.protein * grams / 100 * 10) / 10;
  }

  calculateCarbs(food: FoodSearchItem, grams: number): number {
    return Math.round(food.carbs * grams / 100 * 10) / 10;
  }

  calculateFat(food: FoodSearchItem, grams: number): number {
    return Math.round(food.fat * grams / 100 * 10) / 10;
  }

  private setupNetworkListener() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  private setupSearchListener() {
    // Set up typeahead search
    this.searchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.isSearching.set(true);
          this.showSearchResults = false;
        }),
        switchMap((query) => {
          if (!query || query.length < 2) {
            this.searchResults.set([]);
            return of([]);
          }
          return this.searchFoods(query);
        })
      )
      .subscribe({
        next: (results) => {
          this.searchResults.set(results);
          this.showSearchResults = results.length > 0;
          this.isSearching.set(false);
        },
        error: (error) => {
          console.error('Search error:', error);
          this.searchResults.set([]);
          this.showSearchResults = false;
          this.isSearching.set(false);
          if (!this.isOnline()) {
            this.errorMessage = 'Search is not available offline. Please connect to search for foods.';
          } else {
            this.errorMessage = 'Error searching for foods. Please try again.';
          }
        }
      });
  }

  private async searchFoods(query: string): Promise<FoodSearchItem[]> {
    try {
      const result = await this.mealApiService.searchFoods(query, 5);
      return result.foods;
    } catch (error) {
      console.error('Food search failed:', error);
      throw error;
    }
  }

  selectFood(food: FoodSearchItem) {
    this.searchForm.patchValue({
      selectedFood: food,
      query: food.name
    });
    this.showSearchResults = false;
    this.clearMessages();
  }

  addItem() {
    const selectedFood = this.searchForm.get('selectedFood')?.value;
    const portionGrams = this.searchForm.get('portionGrams')?.value;

    if (!selectedFood || !portionGrams) {
      this.errorMessage = 'Please search for a food item and enter a portion size.';
      return;
    }

    // Calculate macros based on portion (nutrition data is per 100g)
    const portionFactor = portionGrams / 100;
    const macros = {
      calories: Math.round(selectedFood.calories * portionFactor),
      protein: Math.round(selectedFood.protein * portionFactor * 10) / 10,
      carbs: Math.round(selectedFood.carbs * portionFactor * 10) / 10,
      fat: Math.round(selectedFood.fat * portionFactor * 10) / 10,
    };

    const newItem: MealItem = {
      name: selectedFood.name,
      portionGrams,
      macros
    };

    // Add to items list
    this.items.update(currentItems => [...currentItems, newItem]);

    // Reset form
    this.searchForm.reset({
      query: '',
      selectedFood: null,
      portionGrams: 100
    });
    this.showSearchResults = false;
    this.clearMessages();
    this.successMessage = `Added ${selectedFood.name} to your meal.`;
  }

  removeItem(index: number) {
    this.items.update(currentItems => currentItems.filter((_, i) => i !== index));
    this.clearMessages();
  }

  updateItemPortion(index: number, newPortion: number) {
    if (newPortion <= 0) return;

    this.items.update(currentItems => {
      const updatedItems = [...currentItems];
      const item = updatedItems[index];
      const originalPortion = item.portionGrams;
      const factor = newPortion / originalPortion;

      // Recalculate macros
      updatedItems[index] = {
        ...item,
        portionGrams: newPortion,
        macros: {
          calories: Math.round(item.macros.calories * factor),
          protein: Math.round(item.macros.protein * factor * 10) / 10,
          carbs: Math.round(item.macros.carbs * factor * 10) / 10,
          fat: Math.round(item.macros.fat * factor * 10) / 10,
        }
      };

      return updatedItems;
    });
  }

  get totalMacros() {
    const items = this.items();
    return {
      calories: items.reduce((sum, item) => sum + item.macros.calories, 0),
      protein: Math.round(items.reduce((sum, item) => sum + item.macros.protein, 0) * 10) / 10,
      carbs: Math.round(items.reduce((sum, item) => sum + item.macros.carbs, 0) * 10) / 10,
      fat: Math.round(items.reduce((sum, item) => sum + item.macros.fat, 0) * 10) / 10,
    };
  }

  get canSave(): boolean {
    return this.items().length > 0 && !this.isSaving();
  }

  canAddItem(): boolean {
    return !!(this.searchForm.get('selectedFood')?.value && this.searchForm.get('portionGrams')?.value);
  }

  onPortionChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (value > 0) {
      this.updateItemPortion(index, value);
    }
  }

  get itemsCount(): number {
    return this.items().length;
  }

  async saveMeal() {
    if (!this.canSave) return;

    this.isSaving.set(true);
    this.clearMessages();

    try {
      const mealData = {
        takenAt: new Date().toISOString(),
        items: this.items().map(item => ({
          name: item.name,
          portionGrams: item.portionGrams
        }))
      };

      if (this.isOnline()) {
        // Save directly to server
        await this.mealApiService.createManualMeal(mealData);
        this.successMessage = 'Meal saved successfully!';
        
        // Navigate to nutrition summary after short delay
        setTimeout(() => {
          this.router.navigateByUrl('/nutrition');
        }, 1500);
      } else {
        // Save to sync service for offline
        await this.syncService.enqueueMealCreate(mealData);
        this.successMessage = 'Meal saved offline. Will sync when online.';
        
        setTimeout(() => {
          this.router.navigateByUrl('/nutrition');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      this.errorMessage = 'Failed to save meal. Please try again.';
    } finally {
      this.isSaving.set(false);
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  clearSearch() {
    this.searchForm.patchValue({ query: '' });
    this.showSearchResults = false;
    this.searchResults.set([]);
  }

  cancel() {
    this.router.navigateByUrl('/nutrition');
  }
}
