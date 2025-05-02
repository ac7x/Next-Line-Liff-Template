import { User } from '../entities/User';

export interface IUserRepository {
  findByUserId(userId: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
