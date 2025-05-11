import { User } from '@/modules/liff/domain/entities/user';
import { IUserRepository } from '@/modules/liff/domain/repositories/IUserRepository';
import { UserMapper } from '@/modules/liff/infrastructure/mappers/UserMapper';
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
}
