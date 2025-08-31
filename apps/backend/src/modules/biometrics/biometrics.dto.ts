export interface CreateWeightRequest {
  valueKg: number;
  takenAt?: string;
}

export interface WeightEntry {
  id: string;
  valueKg: number;
  takenAt: string;
  createdAt: string;
}
