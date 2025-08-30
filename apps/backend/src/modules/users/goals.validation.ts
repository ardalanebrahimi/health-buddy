import { UpdateGoalsDto } from './goals.service';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUpdateGoals(data: any): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (typeof data.weightGoalKg !== 'number') {
    errors.push('weightGoalKg must be a number');
  } else if (data.weightGoalKg < 20 || data.weightGoalKg > 300) {
    errors.push('weightGoalKg must be between 20 and 300 kg');
  }

  if (typeof data.sleepHoursTarget !== 'number') {
    errors.push('sleepHoursTarget must be a number');
  } else if (
    !Number.isInteger(data.sleepHoursTarget) ||
    data.sleepHoursTarget < 4 ||
    data.sleepHoursTarget > 12
  ) {
    errors.push('sleepHoursTarget must be an integer between 4 and 12 hours');
  }

  // Optional field validation
  if (data.painTarget !== undefined && data.painTarget !== null) {
    if (typeof data.painTarget !== 'number') {
      errors.push('painTarget must be a number');
    } else if (
      !Number.isInteger(data.painTarget) ||
      data.painTarget < 0 ||
      data.painTarget > 10
    ) {
      errors.push('painTarget must be an integer between 0 and 10');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
