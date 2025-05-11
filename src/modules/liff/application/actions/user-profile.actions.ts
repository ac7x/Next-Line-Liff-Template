'use server';

import { LiffDomainService } from '@/modules/liff/domain/services/liff-domain-service';
import { PrismaUserRepository } from '@/modules/liff/infrastructure/repositories/prisma-user-repository';
import { SaveUserProfileCommand } from '../commands/save-user-profile.command';
import { SaveUserProfileHandler } from '../commands/save-user-profile.handler';
import { LiffProfileServerDTO } from '../dto/liff-profile.dto';
import { GetUserProfileHandler } from '../queries/get-user-profile.handler';
import { GetUserProfileQuery } from '../queries/get-user-profile.query';

/**
 * 查詢使用者個人資料 - 實現 CQRS 中的查詢部分
 */
export async function getUserProfile(userId: string) {
  try {
    const repository = new PrismaUserRepository();
    const handler = new GetUserProfileHandler(repository);
    
    const query: GetUserProfileQuery = { userId };
    return await handler.handle(query);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * 保存使用者個人資料 - 實現 CQRS 中的命令部分
 */
export async function saveUserProfile(profileData: LiffProfileServerDTO) {
  try {
    const repository = new PrismaUserRepository();
    const domainService = new LiffDomainService();
    const handler = new SaveUserProfileHandler(repository, domainService);
    
    const command: SaveUserProfileCommand = {
      userId: profileData.userId,
      displayName: profileData.displayName,
      pictureUrl: profileData.pictureUrl,
      statusMessage: profileData.statusMessage
    };
    
    return await handler.handle(command);
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 更新使用者好友狀態
 */
export async function updateUserFriendship(userId: string, isFriend: boolean) {
  try {
    const repository = new PrismaUserRepository();
    const domainService = new LiffDomainService();
    
    const existingUser = await repository.findByUserId(userId);
    if (!existingUser) {
      return { success: false, message: 'User not found' };
    }
    
    const updatedUser = domainService.processFriendshipUpdate(existingUser, isFriend);
    await repository.save(updatedUser);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating friendship status:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
