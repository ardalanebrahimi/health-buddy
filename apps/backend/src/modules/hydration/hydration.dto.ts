export interface CreateHydrationDto {
  amountMl: number;
  takenAt: string;
}

export interface GetHydrationSummaryDto {
  date: string;
}

export interface GetHydrationEntriesDto {
  date?: string;
}

export function validateCreateHydrationDto(body: any): CreateHydrationDto {
  const { amountMl, takenAt } = body;

  if (typeof amountMl !== 'number' || amountMl <= 0 || amountMl > 3000) {
    throw new Error('amountMl must be a number between 1 and 3000');
  }

  if (!takenAt || typeof takenAt !== 'string') {
    throw new Error('takenAt is required and must be a string');
  }

  // Validate date format
  const date = new Date(takenAt);
  if (isNaN(date.getTime())) {
    throw new Error('takenAt must be a valid ISO date string');
  }

  return { amountMl, takenAt };
}

export function validateGetHydrationSummaryDto(
  query: any
): GetHydrationSummaryDto {
  const { date } = query;

  if (!date || typeof date !== 'string') {
    throw new Error(
      'date is required and must be a string in YYYY-MM-DD format'
    );
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error('date must be in YYYY-MM-DD format');
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error('date must be a valid date');
  }

  return { date };
}

export function validateGetHydrationEntriesDto(
  query: any
): GetHydrationEntriesDto {
  const { date } = query;

  if (date && typeof date !== 'string') {
    throw new Error('date must be a string in YYYY-MM-DD format');
  }

  if (date) {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('date must be in YYYY-MM-DD format');
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('date must be a valid date');
    }
  }

  return { date };
}
