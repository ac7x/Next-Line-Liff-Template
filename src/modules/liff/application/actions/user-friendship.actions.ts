'use server';

import { LiffDomainService } from '@/modules/liff/domain/services/liff-domain-service';
import { PrismaUserRepository } from '@/modules/liff/infrastructure/repositories/prisma-user-repository';

/**
 * 更新使用者與 LINE Bot 的好友關係
 */
export async function updateUserFriendship(userId: string, isFriend: boolean) {
  try {
    const repository = new PrismaUserRepository();
    const domainService = new LiffDomainService();
    
    const existingUser = await repository.findByUserId(userId);
    if (!existingUser) {
      return { success: false, message: '找不到使用者' };
    }
    
    // 創建使用者聚合根
    const userAggregate = domainService.createAggregateFromUser(existingUser);
    
    // 更新好友關係
    const updatedUserAggregate = domainService.processFriendshipUpdate(userAggregate, isFriend);
    
    // 保存更新後的使用者實體
    await repository.save(updatedUserAggregate.getRoot());
    
    return { 
      success: true,
      userId: updatedUserAggregate.getRoot().userId
    };
  } catch (error) {
    console.error('更新好友狀態時發生錯誤:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '未知錯誤' 
    };
  }
}
