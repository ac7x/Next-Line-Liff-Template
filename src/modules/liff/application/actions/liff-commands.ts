'use server';

import { User } from '@/modules/liff/domain/entities/user';
import { LiffDomainService } from '@/modules/liff/domain/services/liff-domain-service';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/liff-profile';
import { ProfileServerDTO } from '@/modules/liff/infrastructure/dtos/liff-profile.dto';
import { PrismaUserRepository } from '@/modules/liff/infrastructure/repositories/prisma-user-repository';

function handleError(error: unknown): { success: false; message: string } {
  console.error('Error:', error);
  return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
}

function createProfile(profileData: ProfileServerDTO): LiffProfile {
  return new LiffProfile(
    profileData.userId,
    profileData.displayName,
    profileData.pictureUrl,
    profileData.statusMessage
  );
}

/**
 * 儲存使用者 Profile 的 Command Action
 * 符合 CQRS 中的 Command 部分，負責寫入操作
 */
export async function saveUserProfile(profileData?: ProfileServerDTO) {
  try {
    if (!profileData || !profileData.userId) {
      return { success: false, message: 'No user profile data provided' };
    }

    // 使用領域服務處理業務邏輯
    const domainService = new LiffDomainService();
    const repository = new PrismaUserRepository();
    
    const existingUser = await repository.findByUserId(profileData.userId);
    const profile = createProfile(profileData);
    
    let user: User;
    
    if (existingUser) {
      // 使用領域服務處理配置檔案更新
      user = domainService.processProfileUpdate(existingUser, profile);
    } else {
      // 新建使用者
      user = new User(profileData.userId, profile, false);
    }
    
    const savedUser = await repository.save(user);
    return { success: true, userId: savedUser.userId };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * 更新使用者好友狀態的 Command Action
 */
export async function updateUserFriendship(userId: string, isFriend: boolean) {
  try {
    const repository = new PrismaUserRepository();
    const domainService = new LiffDomainService();
    
    const user = await repository.findByUserId(userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const updatedUser = domainService.processFriendshipUpdate(user, isFriend);
    await repository.save(updatedUser);
    
    return { success: true, userId };
  } catch (error) {
    return handleError(error);
  }
}
