import { LineBotWebhookPage } from '@/modules/lineBot/interfaces/pages/LineBotWebhookPage';

// 明確指定使用 Node.js 運行時而非 Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function WebhookPage() {
  return <LineBotWebhookPage />;
}
