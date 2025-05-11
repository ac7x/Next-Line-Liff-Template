// filepath: /workspaces/Next-Line-Liff-Template/src/modules/liff/infrastructure/di/liff-service-provider.ts
import { LiffApplicationService } from '@/modules/liff/application/services/liff-application.service';
import { PrismaUserRepository } from '../repositories/prisma-user-repository';
import { liffSdkService } from '../services/liff-sdk.service';

let applicationService: LiffApplicationService | null = null;

export function getApplicationService(): LiffApplicationService {
  if (!applicationService) {
    const userRepository = new PrismaUserRepository();
    applicationService = new LiffApplicationService(liffSdkService, userRepository);
  }

  return applicationService;
}
