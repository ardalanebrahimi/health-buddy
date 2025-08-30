export interface CreateProfileRequest {
  age: number;
  sex: 'M' | 'F' | 'Other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
}

export interface UpdateBaselineRequest {
  conditions?: string[];
  painAreas?: string[];
  notes?: string | null;
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

export function validateUpdateBaseline(data: any): {
  isValid: boolean;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  // Conditions validation - optional array of strings
  if (data.conditions !== undefined) {
    if (!Array.isArray(data.conditions)) {
      errors.push({
        field: 'conditions',
        message: 'Conditions must be an array',
      });
    } else {
      // Check each condition is a string
      for (let i = 0; i < data.conditions.length; i++) {
        if (typeof data.conditions[i] !== 'string') {
          errors.push({
            field: 'conditions',
            message: `Condition at index ${i} must be a string`,
          });
        }
      }
    }
  }

  // Pain areas validation - optional array with enum values
  if (data.painAreas !== undefined) {
    if (!Array.isArray(data.painAreas)) {
      errors.push({
        field: 'painAreas',
        message: 'Pain areas must be an array',
      });
    } else {
      const validPainAreas = [
        'lower_back',
        'shoulders',
        'elbows',
        'coccyx',
        'other',
      ];
      for (let i = 0; i < data.painAreas.length; i++) {
        if (
          typeof data.painAreas[i] !== 'string' ||
          !validPainAreas.includes(data.painAreas[i])
        ) {
          errors.push({
            field: 'painAreas',
            message: `Pain area at index ${i} must be one of: ${validPainAreas.join(
              ', '
            )}`,
          });
        }
      }
    }
  }

  // Notes validation - optional string with max length
  if (data.notes !== undefined && data.notes !== null) {
    if (typeof data.notes !== 'string') {
      errors.push({
        field: 'notes',
        message: 'Notes must be a string',
      });
    } else if (data.notes.length > 500) {
      errors.push({
        field: 'notes',
        message: 'Notes must be 500 characters or less',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
