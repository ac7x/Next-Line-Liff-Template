import { IUserRepository } from '@/modules/liff/domain/repositories/user-repository.interface';
import { LiffProfileResponseDTO } from '../dto/liff-profile.dto';
import { GetUserProfileQuery } from './get-user-profile.query';

export class GetUserProfileHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(query: GetUserProfileQuery): Promise<LiffProfileResponseDTO | null> {
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
        displayName: user.profile.displayName,
        pictureUrl: user.profile.pictureUrl,
        statusMessage: user.profile.statusMessage,
        isFriend: user.isFriend
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}
