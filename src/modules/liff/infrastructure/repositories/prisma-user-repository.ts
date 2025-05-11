import { User } from '@/modules/liff/domain/entities/user';
import { IUserRepository } from '@/modules/liff/domain/repositories/user-repository.interface';
import { UserMapper } from '@/modules/liff/infrastructure/mappers/user.mapper';
import { prisma } from '@/modules/shared/infrastructure/persistence/prisma/client';

export class PrismaUserRepository implements IUserRepository {
  private prisma: typeof prisma;
  private mapper: UserMapper;

  constructor() {
    this.prisma = prisma;
    this.mapper = new UserMapper();
  }

  async findByUserId(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }

  async save(user: User): Promise<User> {
    const userData = this.mapper.toPersistence(user);

    const savedUser = await this.prisma.user.upsert({
      where: { userId: userData.userId },
      update: userData,
      create: userData,
    });

    return this.mapper.toDomain(savedUser);
  }

  async findByFriendshipStatus(isFriend: boolean): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isFriend },
    });

    return users.map(user => this.mapper.toDomain(user));
  }

  async delete(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { userId },
      });
      return true;
    } catch (error) {
      console.error(`刪除使用者錯誤: ${error}`);
      return false;
    }
  }
}
