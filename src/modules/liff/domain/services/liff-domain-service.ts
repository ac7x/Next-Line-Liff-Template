import { UserAggregate } from '../aggregates/user-aggregate';
import { User } from '../entities/user';
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

  createAggregateFromUser(user: User): UserAggregate {
    return UserAggregate.createFrom(user);
  }

  processProfileUpdate(userAggregate: UserAggregate, profile: LiffProfile): UserAggregate {
    // 在這裡可以加入更多業務邏輯，例如特定條件下禁止更新某些資料
    if (!this.validateProfile(profile)) {
      throw new Error('無效的使用者資料');
    }

    // 透過聚合根更新個人資料
    userAggregate.updateProfile(profile);

    // 在實際系統中，這裡可以獲取並處理未提交的事件
    // const events = userAggregate.getUncommittedEvents();
    // events.forEach(event => eventBus.publish(event));
    // userAggregate.clearUncommittedEvents();

    return userAggregate;
  }

  processFriendshipUpdate(userAggregate: UserAggregate, isFriend: boolean): UserAggregate {
    // 在這裡可以加入更複雜的業務邏輯，例如根據好友狀態變更給予優惠等
    userAggregate.updateFriendship(isFriend);

    // 在實際系統中，這裡可以獲取並處理未提交的事件
    // const events = userAggregate.getUncommittedEvents();
    // events.forEach(event => eventBus.publish(event));
    // userAggregate.clearUncommittedEvents();

    return userAggregate;
  }
}
