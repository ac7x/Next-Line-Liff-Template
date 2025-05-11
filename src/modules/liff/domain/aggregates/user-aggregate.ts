import { User } from '../entities/user';
import { LiffProfileUpdatedEvent } from '../events/liff-profile-updated.event';
import { LiffProfile } from '../valueObjects/liff-profile';

/**
 * 使用者聚合根
 * 管理與使用者相關的實體集合和業務規則
 */
export class UserAggregate {
  private _rootEntity: User;
  private _events: any[] = [];

  private constructor(user: User) {
    this._rootEntity = user;
  }

  /**
   * 從現有使用者實體創建聚合根
   */
  static createFrom(user: User): UserAggregate {
    return new UserAggregate(user);
  }

  /**
   * 創建新的使用者聚合根
   */
  static createNew(userId: string, profile: LiffProfile): UserAggregate {
    const user = new User(userId, profile);
    return new UserAggregate(user);
  }

  /**
   * 更新使用者個人資料
   */
  updateProfile(profile: LiffProfile): void {
    if (!this._rootEntity) {
      throw new Error('使用者實體不存在');
    }

    const oldProfile = this._rootEntity.profile;
    this._rootEntity.updateProfile(profile);

    // 記錄個人資料更新事件
    this._events.push(
      LiffProfileUpdatedEvent.createNew(
        this._rootEntity.userId,
        oldProfile,
        profile
      )
    );
  }

  /**
   * 更新使用者與 LINE Bot 的好友關係
   */
  updateFriendship(isFriend: boolean): void {
    if (!this._rootEntity) {
      throw new Error('使用者實體不存在');
    }

    const oldFriendshipStatus = this._rootEntity.isFriend;
    this._rootEntity.updateFriendship(isFriend);

    // 這裡可以加入好友關係更新事件，例如：
    // this._events.push(
    //   new FriendshipStatusChangedEvent(
    //     this._rootEntity.userId,
    //     oldFriendshipStatus,
    //     isFriend
    //   )
    // );
  }

  /**
   * 獲取使用者實體
   */
  getRoot(): User {
    return this._rootEntity;
  }

  /**
   * 獲取未發布的領域事件
   */
  getUncommittedEvents(): any[] {
    return [...this._events];
  }

  /**
   * 清除未發布的事件
   */
  clearUncommittedEvents(): void {
    this._events = [];
  }
}
