import { PrismaClient } from '@prisma/client';
import {
  CreateWeightRequest,
  WeightEntry,
  CreateWaistRequest,
  WaistEntry,
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
}
