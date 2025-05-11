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
    console.log('保存使用者資料:', profileData);
    const repository = new PrismaUserRepository();
    const domainService = new LiffDomainService();
    const handler = new SaveUserProfileHandler(repository, domainService);
    
    // 驗證所需的欄位
    if (!profileData.userId || !profileData.displayName) {
      console.error('缺少必要的用戶資料欄位');
      return { 
        success: false, 
        message: '用戶 ID 和顯示名稱為必填' 
      };
    }
    
    const command: SaveUserProfileCommand = {
      userId: profileData.userId,
      displayName: profileData.displayName,
      pictureUrl: profileData.pictureUrl,
      statusMessage: profileData.statusMessage
    };
    
    const result = await handler.handle(command);
    console.log('使用者資料保存結果:', result);
    return result;
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 更新使用者好友狀態 (這個方法已移至 user-friendship.actions.ts)
 * @deprecated 請使用 @/modules/liff/application/actions/user-friendship.actions 中的函數
 */
export async function updateUserFriendship(userId: string, isFriend: boolean) {
  // 導向到正確的 action
  const { updateUserFriendship } = await import('./user-friendship.actions');
  return updateUserFriendship(userId, isFriend);
}
