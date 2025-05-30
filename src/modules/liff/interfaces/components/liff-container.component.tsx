'use client';

import { useCallback, useEffect } from 'react';
import { useLiff } from '../hooks/liff.hook';
import { LiffActions } from './liff-actions.component';
import { LiffInfo } from './liff-info.component';
import { LiffInitStatus } from './liff-init-status.component';
import { LiffProfile } from './liff-profile.component';

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
      // 使用者登入後立即保存資料到資料庫，確保用戶資訊最新
      liff.persistUserData().then((result) => {
        if (result.success) {
          console.log('用戶資料成功保存至資料庫！', result);
        } else {
          console.warn('用戶資料保存失敗:', result?.message || '未知錯誤');
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
