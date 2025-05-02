'use server';

import { User } from '@/domain/liff/entities/User';
import { LiffProfile } from '@/domain/liff/valueObjects/LiffProfile';
import { ProfileServerDTO } from '@/infrastructure/liff/dtos/LiffProfileDto';
import { PrismaUserRepository } from '@/infrastructure/liff/repositories/PrismaUserRepository';

export async function saveUserProfile(profileData?: ProfileServerDTO) {
  try {
    if (!profileData || !profileData.userId) {
      return { success: false, message: 'No user profile data provided' };
    }

    const repository = new PrismaUserRepository();
    const existingUser = await repository.findByUserId(profileData.userId);

    const profile = new LiffProfile(
      profileData.userId,
      profileData.displayName,
      profileData.pictureUrl,
      profileData.statusMessage
    );

    if (existingUser) {
      existingUser.updateProfile(profile);
      await repository.save(existingUser);
      return { success: true, userId: existingUser.userId };
    } else {
      const newUser = new User(profileData.userId, profile, false);
      const savedUser = await repository.save(newUser);
      return { success: true, userId: savedUser.userId };
    }
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
