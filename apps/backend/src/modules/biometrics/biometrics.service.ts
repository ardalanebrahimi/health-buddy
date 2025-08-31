import { PrismaClient } from '@prisma/client';
import {
  CreateWeightRequest,
  WeightEntry,
  CreateWaistRequest,
  WaistEntry,
  CreateBPRequest,
  BPEntry,
  CreateHRRequest,
  HREntry,
  CreatePainRequest,
  PainEntry,
  CreateMoodRequest,
  MoodEntry,
  CreateEnergyRequest,
  EnergyEntry,
} from './biometrics.dto';

export class BiometricsService {
  constructor(private prisma: PrismaClient) {}

  async logWeight(
    data: CreateWeightRequest & { userId: string }
  ): Promise<WeightEntry> {
    // Validate weight range
    if (data.valueKg < 20 || data.valueKg > 300) {
      throw new Error('Weight must be between 20 and 300 kg');
    }

    const result = await this.prisma.biometricsWeight.create({
      data: {
        userId: data.userId,
        valueKg: data.valueKg,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(`weight_logged ${data.valueKg} ${data.userId}`);

    return {
      id: result.id,
      valueKg: Number(result.valueKg),
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getLatestWeight(userId: string): Promise<WeightEntry | null> {
    const result = await this.prisma.biometricsWeight.findFirst({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      valueKg: Number(result.valueKg),
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getWeightEntries(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ entries: WeightEntry[]; total: number }> {
    const where: any = { userId };

    if (startDate || endDate) {
      where.takenAt = {};
      if (startDate) {
        where.takenAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.takenAt.lte = new Date(endDate);
      }
    }

    const results = await this.prisma.biometricsWeight.findMany({
      where,
      orderBy: { takenAt: 'desc' },
    });

    const entries = results.map((result) => ({
      id: result.id,
      valueKg: Number(result.valueKg),
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    }));

    return {
      entries,
      total: entries.length,
    };
  }

  async logWaist(
    data: CreateWaistRequest & { userId: string }
  ): Promise<WaistEntry> {
    // Validate waist circumference range
    if (data.valueCm < 40 || data.valueCm > 200) {
      throw new Error('Waist circumference must be between 40 and 200 cm');
    }

    const result = await this.prisma.biometricsWaist.create({
      data: {
        userId: data.userId,
        valueCm: data.valueCm,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(`waist_logged ${data.valueCm} ${data.userId}`);

    return {
      id: result.id,
      valueCm: result.valueCm,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getLatestWaist(userId: string): Promise<WaistEntry | null> {
    const result = await this.prisma.biometricsWaist.findFirst({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      valueCm: result.valueCm,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getWaistEntries(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ entries: WaistEntry[]; total: number }> {
    const where: any = { userId };

    if (startDate || endDate) {
      where.takenAt = {};
      if (startDate) {
        where.takenAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.takenAt.lte = new Date(endDate);
      }
    }

    const results = await this.prisma.biometricsWaist.findMany({
      where,
      orderBy: { takenAt: 'desc' },
    });

    const entries = results.map((result) => ({
      id: result.id,
      valueCm: result.valueCm,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    }));

    return {
      entries,
      total: entries.length,
    };
  }

  async logBP(data: CreateBPRequest & { userId: string }): Promise<BPEntry> {
    // Validate blood pressure ranges
    if (data.systolic < 80 || data.systolic > 200) {
      throw new Error('Systolic pressure must be between 80 and 200 mmHg');
    }
    if (data.diastolic < 50 || data.diastolic > 120) {
      throw new Error('Diastolic pressure must be between 50 and 120 mmHg');
    }
    if (data.pulse < 40 || data.pulse > 180) {
      throw new Error('Pulse must be between 40 and 180 bpm');
    }

    const result = await this.prisma.biometricsBP.create({
      data: {
        userId: data.userId,
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(
      `bp_logged ${data.systolic}/${data.diastolic} pulse:${data.pulse} ${data.userId}`
    );

    return {
      id: result.id,
      systolic: result.systolic,
      diastolic: result.diastolic,
      pulse: result.pulse,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getRecentBP(userId: string, limit: number = 10): Promise<BPEntry[]> {
    const results = await this.prisma.biometricsBP.findMany({
      where: { userId },
      orderBy: { takenAt: 'desc' },
      take: limit,
    });

    return results.map((result) => ({
      id: result.id,
      systolic: result.systolic,
      diastolic: result.diastolic,
      pulse: result.pulse,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    }));
  }

  async logHR(data: CreateHRRequest & { userId: string }): Promise<HREntry> {
    // Validate heart rate range
    if (data.bpm < 30 || data.bpm > 200) {
      throw new Error('Heart rate must be between 30 and 200 bpm');
    }

    const result = await this.prisma.biometricsHR.create({
      data: {
        userId: data.userId,
        bpm: data.bpm,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(`hr_logged ${data.bpm} ${data.userId}`);

    return {
      id: result.id,
      bpm: result.bpm,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getRecentHR(userId: string, limit: number = 10): Promise<HREntry[]> {
    const results = await this.prisma.biometricsHR.findMany({
      where: { userId },
      orderBy: { takenAt: 'desc' },
      take: limit,
    });

    return results.map((result) => ({
      id: result.id,
      bpm: result.bpm,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    }));
  }

  async logPain(
    data: CreatePainRequest & { userId: string }
  ): Promise<PainEntry> {
    // Validate score range
    if (data.score < 1 || data.score > 10) {
      throw new Error('Pain score must be between 1 and 10');
    }

    // Validate location enum
    const validLocations = [
      'lower_back',
      'between_shoulders',
      'elbows',
      'coccyx',
      'other',
    ];
    if (!validLocations.includes(data.location)) {
      throw new Error(
        `Invalid location. Must be one of: ${validLocations.join(', ')}`
      );
    }

    const result = await this.prisma.biometricsPain.create({
      data: {
        userId: data.userId,
        location: data.location,
        score: data.score,
        note: data.note,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(`pain_logged ${data.score} ${data.location} ${data.userId}`);

    return {
      id: result.id,
      location: result.location,
      score: result.score,
      note: result.note,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getLatestPain(userId: string): Promise<PainEntry | null> {
    const result = await this.prisma.biometricsPain.findFirst({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      location: result.location,
      score: result.score,
      note: result.note,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getRecentPain(
    userId: string,
    limit: number = 10
  ): Promise<PainEntry[]> {
    const results = await this.prisma.biometricsPain.findMany({
      where: { userId },
      orderBy: { takenAt: 'desc' },
      take: limit,
    });

    return results.map((result) => ({
      id: result.id,
      location: result.location,
      score: result.score,
      note: result.note,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    }));
  }

  async logMood(
    data: CreateMoodRequest & { userId: string }
  ): Promise<MoodEntry> {
    // Validate mood is in allowed set
    const allowedMoods = ['😀', '🙂', '😐', '🙁', '😴', '😊', '🤗'];
    if (!allowedMoods.includes(data.mood)) {
      throw new Error(`Mood must be one of: ${allowedMoods.join(', ')}`);
    }

    const result = await this.prisma.biometricsMood.create({
      data: {
        userId: data.userId,
        moodChar: data.mood,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(`mood_logged ${data.mood} ${data.userId}`);

    return {
      id: result.id,
      mood: result.moodChar,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getLatestMood(userId: string): Promise<MoodEntry | null> {
    const result = await this.prisma.biometricsMood.findFirst({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      mood: result.moodChar,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async logEnergy(
    data: CreateEnergyRequest & { userId: string }
  ): Promise<EnergyEntry> {
    // Validate energy score range
    if (data.score < 1 || data.score > 10) {
      throw new Error('Energy score must be between 1 and 10');
    }

    const result = await this.prisma.biometricsEnergy.create({
      data: {
        userId: data.userId,
        score: data.score,
        takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      },
    });

    // Log telemetry
    console.log(`energy_logged ${data.score} ${data.userId}`);

    return {
      id: result.id,
      score: result.score,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }

  async getLatestEnergy(userId: string): Promise<EnergyEntry | null> {
    const result = await this.prisma.biometricsEnergy.findFirst({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      score: result.score,
      takenAt: result.takenAt.toISOString(),
      createdAt: result.createdAt.toISOString(),
    };
  }
}
