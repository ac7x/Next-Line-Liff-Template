import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

class PrismaClientSingleton {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
    }
    return PrismaClientSingleton.instance;
  }
}

const prisma = global.prisma ?? PrismaClientSingleton.getInstance();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
