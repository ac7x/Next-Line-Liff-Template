import { LineBotApplicationService } from '@/application/lineBot/services/LineBotApplicationService';
import { LineBotService } from '@/domain/lineBot/services/LineBotService';
import { BotVerificationService } from '@/domain/lineBot/services/BotVerificationService';
import { LineBotApiService } from '@/infrastructure/lineBot/services/LineBotApiService';

// 單例模式
let applicationService: LineBotApplicationService | null = null;

export function getLineBotApplicationService(): LineBotApplicationService {
  if (!applicationService) {
    const channelId = process.env.LINE_CHANNEL_ID || '';
    const channelSecret = process.env.LINE_CHANNEL_SECRET || '';
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

    // 建立領域服務
    const lineBotService = new LineBotService(channelId);

    // 建立基礎設施服務
    const botApiService = new LineBotApiService(channelAccessToken, channelSecret);
    const verificationService = new BotVerificationService(channelSecret);

    // 建立應用服務
    applicationService = new LineBotApplicationService(
      lineBotService,
      botApiService,
      verificationService
    );
  }

  return applicationService;
}
