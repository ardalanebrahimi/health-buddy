import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProfileDto {
  age: number;
  sex: 'M' | 'F' | 'Other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
}

export interface ProfileDto {
  id: string;
  userId: string;
  age: number;
  sex: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  baselineJson?: any;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileService {
  private static readonly SINGLE_USER_ID = 'single-user-v1';

  static async getProfile(): Promise<ProfileDto | null> {
    const profile = await prisma.profile.findUnique({
      where: { userId: this.SINGLE_USER_ID },
    });

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      userId: profile.userId,
      age: profile.age!,
      sex: profile.sex!,
      heightCm: profile.heightCm!,
      weightKg: Number(profile.weightKg!),
      activityLevel: profile.activityLevel!,
      baselineJson: profile.baselineJson,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  static async createOrUpdateProfile(
    data: CreateProfileDto
  ): Promise<ProfileDto> {
    const profile = await prisma.profile.upsert({
      where: { userId: this.SINGLE_USER_ID },
      update: {
        age: data.age,
        sex: data.sex,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        activityLevel: data.activityLevel,
      },
      create: {
        userId: this.SINGLE_USER_ID,
        age: data.age,
        sex: data.sex,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        activityLevel: data.activityLevel,
      },
    });

    return {
      id: profile.id,
      userId: profile.userId,
      age: profile.age!,
      sex: profile.sex!,
      heightCm: profile.heightCm!,
      weightKg: Number(profile.weightKg!),
      activityLevel: profile.activityLevel!,
      baselineJson: profile.baselineJson,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
