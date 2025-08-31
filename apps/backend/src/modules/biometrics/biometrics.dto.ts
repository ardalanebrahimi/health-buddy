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

export interface CreateWaistRequest {
  valueCm: number;
  takenAt?: string;
}

export interface WaistEntry {
  id: string;
  valueCm: number;
  takenAt: string;
  createdAt: string;
}
