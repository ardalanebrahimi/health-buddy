export interface CreateProfileRequest {
  age: number;
  sex: 'M' | 'F' | 'Other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateProfile(data: any): {
  isValid: boolean;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  // Age validation
  if (typeof data.age !== 'number' || data.age < 5 || data.age > 120) {
    errors.push({
      field: 'age',
      message: 'Age must be a number between 5 and 120',
    });
  }

  // Sex validation
  if (!data.sex || !['M', 'F', 'Other'].includes(data.sex)) {
    errors.push({ field: 'sex', message: 'Sex must be M, F, or Other' });
  }

  // Height validation
  if (
    typeof data.heightCm !== 'number' ||
    data.heightCm < 120 ||
    data.heightCm > 230
  ) {
    errors.push({
      field: 'heightCm',
      message: 'Height must be a number between 120 and 230 cm',
    });
  }

  // Weight validation
  if (
    typeof data.weightKg !== 'number' ||
    data.weightKg < 20 ||
    data.weightKg > 300
  ) {
    errors.push({
      field: 'weightKg',
      message: 'Weight must be a number between 20 and 300 kg',
    });
  }

  // Activity level validation
  if (
    !data.activityLevel ||
    !['sedentary', 'light', 'moderate', 'active'].includes(data.activityLevel)
  ) {
    errors.push({
      field: 'activityLevel',
      message: 'Activity level must be sedentary, light, moderate, or active',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
