'use client';

import { useCallback, useEffect } from 'react';
import { useLiff } from '../hooks/useLiff';
import { LiffActions } from './LiffActions';
import { LiffInfo } from './LiffInfo';
import { LiffProfile } from './LiffProfile';

export function LiffContainer() {
  const liff = useLiff();

  // 使用 useCallback 避免不必要的重渲染
  const handleLogin = useCallback(async () => {
    await liff.login();
    // 登入後立即刷新資料
    await liff.refreshProfile();
  }, [liff]);

  // 使用 useEffect 處理初始化後的資料持久化
  useEffect(() => {
    if (liff.isInitialized && liff.isLoggedIn) {
      liff.persistUserData().then((result) => {
        if (result.success) {
          console.log('User data persisted successfully', result);
        }
      });
    }
  }, [liff.isInitialized, liff.isLoggedIn, liff.persistUserData]);

  if (!liff.isInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500">初始化 LIFF 中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {liff.error ? (
        <div className="mb-4 w-full max-w-md rounded border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-500">LIFF 初始化失敗</p>
          <p className="mt-1 text-sm text-red-400">
            <code>{liff.error}</code>
          </p>
        </div>
      ) : (
        <p className="mb-4 text-green-500">LIFF 初始化成功</p>
      )}
      <div className="w-full max-w-md space-y-4">
        <LiffInfo {...liff} />
        <LiffProfile profile={liff.profile} friendship={liff.friendship} />
        <LiffActions
          isLoggedIn={liff.isLoggedIn}
          scanResult={liff.scanResult}
          onLogin={handleLogin}
          onLogout={liff.logout}
          onOpenWindow={liff.openExternalWindow}
          onCloseWindow={liff.closeWindow}
          onScanCode={liff.scanCode}
        />
      </div>
    </div>
  );
}
