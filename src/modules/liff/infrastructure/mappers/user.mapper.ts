// filepath: /workspaces/Next-Line-Liff-Template/src/modules/liff/infrastructure/mappers/user.mapper.ts
import { User } from '@/modules/liff/domain/entities/user';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/liff-profile';
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
