import { UserAggregate } from '@/modules/liff/domain/aggregates/user-aggregate';
import { IUserRepository } from '@/modules/liff/domain/repositories/user-repository.interface';
import { LiffDomainService } from '@/modules/liff/domain/services/liff-domain-service';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/liff-profile';
import { SaveUserProfileCommand, SaveUserProfileResult } from './save-user-profile.command';

export class SaveUserProfileHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly domainService: LiffDomainService
  ) {}

  async handle(command: SaveUserProfileCommand): Promise<SaveUserProfileResult> {
    try {
      if (!command.userId) {
        return { success: false, message: 'No user ID provided' };
      }

      // 創建領域值物件
      const profile = new LiffProfile(
        command.userId,
        command.displayName,
        command.pictureUrl,
        command.statusMessage
      );
      
      // 查詢現有用戶
      const existingUser = await this.userRepository.findByUserId(command.userId);
      
      let userAggregate: UserAggregate;
      
      if (existingUser) {
        // 創建使用者聚合根
        userAggregate = this.domainService.createAggregateFromUser(existingUser);
        // 更新現有用戶的個人資料
        userAggregate = this.domainService.processProfileUpdate(userAggregate, profile);
      } else {
        // 創建新用戶聚合根
        userAggregate = UserAggregate.createNew(command.userId, profile);
      }
      
      // 保存到儲存庫
      const savedUser = await this.userRepository.save(userAggregate.getRoot());
      
      return { 
        success: true,
        userId: savedUser.userId
      };
    } catch (error) {
      console.error('Error saving user profile:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
