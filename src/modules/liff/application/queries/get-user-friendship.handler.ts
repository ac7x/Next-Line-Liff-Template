import { IUserRepository } from '@/modules/liff/domain/repositories/user-repository.interface';
import { FriendshipStatusDTO } from '../dto/friendship-status.dto';
import { GetUserFriendshipQuery } from './get-user-friendship.query';

export class GetUserFriendshipHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(query: GetUserFriendshipQuery): Promise<FriendshipStatusDTO | null> {
    try {
      if (!query.userId) {
        return null;
      }
      
      const user = await this.userRepository.findByUserId(query.userId);
      
      if (!user) {
        return null;
      }
      
      return {
        userId: user.userId,
        isFriend: user.isFriend
      };
    } catch (error) {
      console.error('Error getting user friendship status:', error);
      return null;
    }
  }
}
