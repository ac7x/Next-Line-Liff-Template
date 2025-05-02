'use client';

import { useLiff } from '@/interfaces/liff/liff.hooks'; // Corrected import path
import { useEffect, useState } from 'react';

// Get LIFF ID from environment variables
const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
const lineBotId = process.env.NEXT_PUBLIC_LINE_BOT_ID;

export function LineBotIntegration() {
  // Pass LIFF ID to the hook
  const { isReady, isLoggedIn, isInClient, friendship, openWindow, error, profile } = useLiff(liffId); // Added profile
  const [botStatus, setBotStatus] = useState<'connected' | 'disconnected' | 'checking' | 'error'>('checking');

  useEffect(() => {
    if (error) {
      setBotStatus('error');
      console.error("LIFF Hook Error:", error.message);
      return;
    }

    if (isReady) {
      if (isLoggedIn && friendship !== null) {
        // Friendship status is available
        setBotStatus(friendship.value ? 'connected' : 'disconnected');
      } else if (isLoggedIn && friendship === null) {
        // Logged in, but friendship status still loading or failed? Keep checking.
        setBotStatus('checking');
      } else {
        // Not logged in or LIFF not ready
        setBotStatus('disconnected'); // Or 'checking' if isReady is false?
      }
    } else {
      // Still initializing
      setBotStatus('checking');
    }
  }, [isReady, isLoggedIn, friendship, error]); // Depend on hook states

  const handleAddBot = () => {
    if (!lineBotId) {
      console.error('LINE Bot ID is not configured.');
      return;
    }
    const botUrl = `https://line.me/R/ti/p/@${lineBotId}`;
    if (isInClient) {
      // Use the openWindow method from the hook
      openWindow(botUrl, true); // Open externally in LINE app
    } else {
      // Standard browser behavior
      window.open(botUrl, '_blank');
    }
  };

  // --- 範例：觸發後端動作，可能導致 Bot 發送訊息 ---
  const handleExampleAction = async () => {
    if (!profile?.value.userId) {
      console.error("無法獲取 User ID");
      return;
    }
    try {
      // 假設有一個 Server Action `src/application/user/actions/userActions.ts`
      // const result = await someUserAction(profile.value.userId, { data: 'example' });
      // console.log("Server Action Result:", result);
      // 如果 someUserAction 內部調用了 ILineBotMessageSender.sendPush
      // 使用者將會在 LINE 聊天中收到來自 Bot 的訊息
      alert("範例動作已觸發！後端可能會透過 Bot 發送訊息給您。");
    } catch (actionError) {
      console.error("執行範例動作失敗:", actionError);
      alert("執行範例動作失敗。");
    }
  };
  // --- 範例結束 ---

  if (botStatus === 'error') {
     return <div className="rounded bg-red-100 p-4 text-red-700 shadow">發生錯誤：{error?.message || '無法連接 LINE 服務'}</div>;
  }

  if (botStatus === 'checking') {
    return <div className="p-4">檢查 LINE Bot 連接狀態中... (Ready: {isReady.toString()}, LoggedIn: {isLoggedIn.toString()})</div>;
  }

  if (botStatus === 'disconnected') {
    return (
      <div className="rounded bg-yellow-100 p-4 shadow">
        <h3 className="text-lg font-semibold">尚未連接 LINE Bot</h3>
        <p className="my-2">請加入我們的官方帳號，以獲得完整功能體驗。</p>
        <button
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
          onClick={handleAddBot}
          disabled={!isReady || !lineBotId} // Disable if LIFF not ready or no bot ID
        >
          {lineBotId ? '添加官方帳號' : 'Bot ID 未配置'}
        </button>
      </div>
    );
  }

  // botStatus === 'connected'
  return (
    <div className="rounded bg-green-100 p-4 shadow">
      <h3 className="text-lg font-semibold">LINE Bot 已連接</h3>
      <p className="my-2">您已成功連接我們的官方帳號，可以使用全部功能。</p>
      {/* 加入範例按鈕 */}
      <button
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        onClick={handleExampleAction}
        disabled={!isReady || !isLoggedIn || !profile}
      >
        觸發後端動作 (範例)
      </button>
    </div>
  );
}
