import { User } from '@/domain/liff/entities/User';
import { LiffProfile } from '@/domain/liff/valueObjects/LiffProfile';
import { User as PrismaUser } from '@prisma/client';

export class UserMapper {
  toDomain(persistenceModel: PrismaUser): User {
    const profile = new LiffProfile(
      persistenceModel.userId,
      persistenceModel.displayName,
      persistenceModel.pictureUrl || undefined,
      persistenceModel.statusMessage || undefined
    );

    return new User(persistenceModel.userId, profile);
  }

  toPersistence(domainModel: User): {
    userId: string;
    displayName: string;
    pictureUrl: string | null;
    statusMessage: string | null;
  } {
    const profile = domainModel.profile;

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || null,
      statusMessage: profile.statusMessage || null,
    };
  }
}
