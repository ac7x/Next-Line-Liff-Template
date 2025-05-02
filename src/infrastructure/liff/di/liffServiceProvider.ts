import { LiffApplicationService } from '@/application/liff/services/LiffApplicationService';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { liffSdkService } from '../services/LiffSdkService';

let applicationService: LiffApplicationService | null = null;

export function getApplicationService(): LiffApplicationService {
  if (!applicationService) {
    const userRepository = new PrismaUserRepository();
    applicationService = new LiffApplicationService(liffSdkService, userRepository);
  }

  return applicationService;
}
