import { User } from '../entities/user';

export interface IUserRepository {
  findByUserId(userId: string): Promise<User | null>;
  save(user: User): Promise<User>;
  
  /**
   * 根據好友狀態查詢使用者
   * @param isFriend 好友狀態
   * @returns 符合狀態的使用者列表
   */
  findByFriendshipStatus(isFriend: boolean): Promise<User[]>;
  
  /**
   * 刪除使用者
   * @param userId 使用者ID
   * @returns 是否成功刪除
   */
  delete(userId: string): Promise<boolean>;
}
