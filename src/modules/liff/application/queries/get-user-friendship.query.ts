
/**
 * 獲取使用者與 LINE Bot 的好友關係查詢
 */
export class GetUserFriendshipQuery {
  constructor(public readonly userId: string) {}

  static create(userId: string): GetUserFriendshipQuery {
    if (!userId || typeof userId !== 'string') {
      throw new Error('使用者 ID 必須是有效的字串');
    }
    return new GetUserFriendshipQuery(userId);
  }
}
