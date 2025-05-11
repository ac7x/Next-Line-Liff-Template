import { User } from '../entities/user';

export interface IUserRepository {
  findByUserId(userId: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
