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

export interface CreateBPRequest {
  systolic: number;
  diastolic: number;
  pulse: number;
  takenAt?: string;
}

export interface BPEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  takenAt: string;
  createdAt: string;
}

export interface CreateHRRequest {
  bpm: number;
  takenAt?: string;
}

export interface HREntry {
  id: string;
  bpm: number;
  takenAt: string;
  createdAt: string;
}

export interface CreatePainRequest {
  location: string;
  score: number;
  note?: string;
  takenAt?: string;
}

export interface PainEntry {
  id: string;
  location: string;
  score: number;
  note?: string;
  takenAt: string;
  createdAt: string;
}
