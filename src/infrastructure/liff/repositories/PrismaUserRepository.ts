import { User } from '@/domain/liff/entities/User';
import { IUserRepository } from '@/domain/liff/repositories/IUserRepository';
import { PrismaClient } from '@prisma/client';
import { UserMapper } from '../mappers/UserMapper';

export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient;
  private mapper: UserMapper;

  constructor() {
    this.prisma = new PrismaClient();
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
      update: {
        displayName: userData.displayName,
        pictureUrl: userData.pictureUrl,
        statusMessage: userData.statusMessage,
      },
      create: userData,
    });

    return this.mapper.toDomain(savedUser);
  }
}
