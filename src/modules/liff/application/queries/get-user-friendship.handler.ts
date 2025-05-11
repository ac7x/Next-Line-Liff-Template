import { IUserRepository } from '@/modules/liff/domain/repositories/user-repository.interface';

export interface FriendshipStatusDTO {
  userId: string;
  isFriend: boolean;
}

export class GetUserFriendshipHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(userId: string): Promise<FriendshipStatusDTO | null> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      
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
