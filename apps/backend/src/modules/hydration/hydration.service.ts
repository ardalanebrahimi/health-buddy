import { PrismaClient } from '@prisma/client';

export interface CreateHydrationData {
  amountMl: number;
  takenAt: Date;
}

export interface HydrationSummary {
  date: string;
  totalLiters: number;
}

export class HydrationService {
  constructor(private prisma: PrismaClient) {}

  async createHydration(userId: string, data: CreateHydrationData) {
    return await this.prisma.hydration.create({
      data: {
        userId,
        amountMl: data.amountMl,
        takenAt: data.takenAt,
      },
    });
  }

  async getHydrationSummary(
    userId: string,
    date: string
  ): Promise<HydrationSummary> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 1);

    const result = await this.prisma.hydration.aggregate({
      _sum: {
        amountMl: true,
      },
      where: {
        userId,
        takenAt: {
          gte: start,
          lt: end,
        },
      },
    });

    const totalMl = result._sum.amountMl ?? 0;
    const totalLiters = totalMl / 1000;

    return {
      date,
      totalLiters,
    };
  }

  async getHydrationEntries(userId: string, date?: string) {
    const where: any = { userId };

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 1);

      where.takenAt = {
        gte: start,
        lt: end,
      };
    }

    const entries = await this.prisma.hydration.findMany({
      where,
      orderBy: {
        takenAt: 'desc',
      },
    });

    const totalMl = entries.reduce((sum, entry) => sum + entry.amountMl, 0);

    return {
      entries: entries.map((entry) => ({
        id: entry.id,
        amountMl: entry.amountMl,
        type: 'water', // For now, all entries are water
        takenAt: entry.takenAt.toISOString(),
        createdAt: entry.createdAt.toISOString(),
      })),
      totalMl,
      goalMl: 2500, // Default goal, could be made configurable later
      date: date || new Date().toISOString().split('T')[0],
    };
  }

  async deleteHydration(userId: string, id: string) {
    // Verify the hydration entry belongs to the user before deleting
    const entry = await this.prisma.hydration.findFirst({
      where: { id, userId },
    });

    if (!entry) {
      throw new Error('Hydration entry not found');
    }

    return await this.prisma.hydration.delete({
      where: { id },
    });
  }

  async getLastHydrationEntry(userId: string) {
    return await this.prisma.hydration.findFirst({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
