import { User } from '../entities/user';
import { LiffProfileUpdatedEvent } from '../events/liff-profile-updated.event';
import { LiffProfile } from '../valueObjects/liff-profile';
import { ILiffDomainService } from './liff-domain-service.interface';

export class LiffDomainService implements ILiffDomainService {
  validateProfile(profile: LiffProfile): boolean {
    // 基本驗證：必須有 userId 和 displayName
    if (!profile.userId || !profile.displayName) {
      return false;
    }

    // 可以增加更多業務相關的驗證邏輯
    return true;
  }

  processProfileUpdate(user: User, profile: LiffProfile): User {
    // 在這裡可以加入更多業務邏輯，例如特定條件下禁止更新某些資料
    if (!this.validateProfile(profile)) {
      throw new Error('無效的使用者資料');
    }

    const oldProfile = user.profile;

    // 更新使用者資料
    user.updateProfile(profile);

    // 建立並發布領域事件 (在完整實作中應該有事件發布機制)
    const event = LiffProfileUpdatedEvent.createNew(user.userId, oldProfile, profile);

    // 在實際系統中，這裡應該把事件發布到事件總線
    // eventBus.publish(event);

    return user;
  }

  processFriendshipUpdate(user: User, isFriend: boolean): User {
    // 在這裡可以加入更複雜的業務邏輯，例如根據好友狀態變更給予優惠等
    user.updateFriendship(isFriend);

    // 在實際系統中，這裡可能需要發布好友關係變更事件
    // const event = new FriendshipChangedEvent(user.userId, isFriend);
    // eventBus.publish(event);

    return user;
  }
}
