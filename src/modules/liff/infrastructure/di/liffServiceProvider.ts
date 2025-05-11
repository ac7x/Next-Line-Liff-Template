import { LiffApplicationService } from '@/modules/liff/application/services/LiffApplicationService';
import { PrismaUserRepository } from '../repositories/prisma-user-repository';
import { liffSdkService } from '../services/LiffSdkService';

let applicationService: LiffApplicationService | null = null;

export function getApplicationService(): LiffApplicationService {
  if (!applicationService) {
    const userRepository = new PrismaUserRepository();
    applicationService = new LiffApplicationService(liffSdkService, userRepository);
  }

  return applicationService;
}
