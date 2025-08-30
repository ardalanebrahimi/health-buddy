import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface GoalsDto {
  weightGoalKg: number;
  sleepHoursTarget: number;
  painTarget?: number;
  updatedAt: string;
}

export interface UpdateGoalsDto {
  weightGoalKg: number;
  sleepHoursTarget: number;
  painTarget?: number;
}

export class GoalsService {
  /**
   * Get user goals by userId
   */
  static async getGoals(
    userId: string = 'default-user'
  ): Promise<GoalsDto | null> {
    try {
      const goal = await prisma.goal.findUnique({
        where: { userId },
      });

      if (!goal) {
        return null;
      }

      return {
        weightGoalKg: goal.weightGoalKg ? Number(goal.weightGoalKg) : 0,
        sleepHoursTarget: goal.sleepHoursTarget || 0,
        painTarget: goal.painTarget || undefined,
        updatedAt: goal.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error getting goals:', error);
      throw new Error('Failed to retrieve goals');
    }
  }

  /**
   * Create or update user goals
   */
  static async updateGoals(
    data: UpdateGoalsDto,
    userId: string = 'default-user'
  ): Promise<GoalsDto> {
    try {
      const goal = await prisma.goal.upsert({
        where: { userId },
        update: {
          weightGoalKg: data.weightGoalKg,
          sleepHoursTarget: data.sleepHoursTarget,
          painTarget: data.painTarget,
          updatedAt: new Date(),
        },
        create: {
          userId,
          weightGoalKg: data.weightGoalKg,
          sleepHoursTarget: data.sleepHoursTarget,
          painTarget: data.painTarget,
        },
      });

      return {
        weightGoalKg: Number(goal.weightGoalKg),
        sleepHoursTarget: goal.sleepHoursTarget!,
        painTarget: goal.painTarget || undefined,
        updatedAt: goal.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error updating goals:', error);
      throw new Error('Failed to update goals');
    }
  }
}
