'use server';

import { getLineBotApplicationService } from '@/infrastructure/lineBot/di/lineBotServiceProvider';

/**
 * 處理來自 LINE 平台的 Webhook 請求。
 * 注意：這是處理 Bot 收到的事件（如使用者發送訊息給 Bot）。
 * 如果是 LIFF 應用程式觸發的後端邏輯需要發送訊息，
 * 則應在相應的應用服務中調用 ILineBotMessageSender.sendPush()。
 */
export async function handleWebhook(body: string, signature: string) {
  try {
    const applicationService = getLineBotApplicationService();
    // LineBotApplicationService 內部會處理事件並可能調用 sendReply
    await applicationService.handleWebhook(body, signature);
    return { success: true };
  } catch (error) {
    if ((error as Error).message === '無效的簽名') {
      return { error: 'Invalid signature', status: 401 };
    }
    console.error('處理 LINE Webhook 時發生錯誤:', error);
    return { error: 'Internal server error', status: 500 };
  }
}
