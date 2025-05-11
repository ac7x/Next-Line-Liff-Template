'use client';

import { useCallback, useEffect } from 'react';
import { useLiff } from '../hooks/useLiff';
import { LiffActions } from './LiffActions';
import { LiffInfo } from './LiffInfo';
import { LiffInitStatus } from './LiffInitStatus';
import { LiffProfile } from './LiffProfile';

interface LiffContainerProps {
  showInitStatus?: boolean;
  showInfo?: boolean;
  showProfile?: boolean;
  showActions?: boolean;
}

export function LiffContainer({ 
  showInitStatus = true,
  showInfo = false, 
  showProfile = false, 
  showActions = false 
}: LiffContainerProps) {
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
    return showInitStatus ? <LiffInitStatus isInitialized={false} /> : null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#00B900]/5 p-4">
      <div className="w-full max-w-md space-y-4">
        {showProfile && <LiffProfile profile={liff.profile} friendship={liff.friendship} />}
        {showInfo && <LiffInfo {...liff} />}
        {showActions && (
          <LiffActions
            isLoggedIn={liff.isLoggedIn}
            scanResult={liff.scanResult}
            onLogin={handleLogin}
            onLogout={liff.logout}
            onOpenWindow={liff.openExternalWindow}
            onCloseWindow={liff.closeWindow}
            onScanCode={liff.scanCode}
          />
        )}
        {showInitStatus && <LiffInitStatus isInitialized={true} error={liff.error} />}
      </div>
    </div>
  );
}
