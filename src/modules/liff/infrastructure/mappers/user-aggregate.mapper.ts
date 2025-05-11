import { UserAggregate } from '@/modules/liff/domain/aggregates/user-aggregate';
import { User } from '@/modules/liff/domain/entities/user';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/liff-profile';
import { User as PrismaUser } from '@prisma/client';

/**
 * 使用者聚合根映射器
 * 負責在持久化模型和領域聚合根之間進行轉換
 */
export class UserAggregateMapper {
  toDomainAggregate(persistenceModel: PrismaUser): UserAggregate {
    const profile = new LiffProfile(
      persistenceModel.userId,
      persistenceModel.displayName,
      persistenceModel.pictureUrl || undefined,
      persistenceModel.statusMessage || undefined
    );

    const user = new User(
      persistenceModel.userId,
      profile,
      persistenceModel.isFriend
    );

    return UserAggregate.createFrom(user);
  }

  toPersistence(aggregate: UserAggregate): {
    userId: string;
    displayName: string;
    pictureUrl: string | null;
    statusMessage: string | null;
    isFriend: boolean;
  } {
    const user = aggregate.getRoot();
    const profile = user.profile;

    return {
      userId: user.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || null,
      statusMessage: profile.statusMessage || null,
      isFriend: user.isFriend
    };
  }
}
