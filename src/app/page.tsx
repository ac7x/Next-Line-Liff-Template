import { LineBotIntegration } from '@/interfaces/lineBot/components/LineBotIntegration';

export default function Home() {
  // Read environment variables on the server
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  const lineBotId = process.env.NEXT_PUBLIC_LINE_BOT_ID;

  // Basic check if the environment variables are set
  if (!liffId) {
    return (
      <div className="container mx-auto p-4">
        <div className="rounded bg-red-100 p-4 text-red-700 shadow">
          發生錯誤：NEXT_PUBLIC_LIFF_ID 環境變數未設定。請檢查您的 .env.local 或環境設定。
        </div>
      </div>
    );
  }
   // Optional: Check for lineBotId as well if it's critical for initial render
   /*
   if (!lineBotId) {
     console.warn("NEXT_PUBLIC_LINE_BOT_ID is not set, 'Add Bot' button might not work correctly.");
   }
   */

  return (
    <div className="container mx-auto p-4">
      <div className="mt-6">
        {/* Pass the environment variables as props */}
        <LineBotIntegration liffId={liffId} lineBotId={lineBotId} />
      </div>
    </div>
  );
}
