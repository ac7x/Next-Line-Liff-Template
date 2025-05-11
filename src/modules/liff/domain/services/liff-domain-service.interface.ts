import { User } from '../entities/user';
import { LiffProfile } from '../valueObjects/liff-profile';

export interface ILiffDomainService {
  /**
   * 驗證 LIFF 配置檔案
   * @param profile LIFF 使用者資料
   */
  validateProfile(profile: LiffProfile): boolean;

  /**
   * 處理使用者配置檔案更新
   * @param user 使用者實體
   * @param profile 新的配置檔案
   * @returns 更新後的使用者實體
   */
  processProfileUpdate(user: User, profile: LiffProfile): User;

  /**
   * 處理好友狀態更新
   * @param user 使用者實體
   * @param isFriend 新的好友狀態
   * @returns 更新後的使用者實體
   */
  processFriendshipUpdate(user: User, isFriend: boolean): User;
}
