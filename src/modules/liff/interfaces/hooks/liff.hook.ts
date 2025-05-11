import { useCallback, useState } from 'react';
import { useLiffContext } from '../contexts/liff-context.provider';

/**
 * 使用 LIFF 的 hook，封裝 LIFF 相關功能
 * 提供更完整的類型支持和功能增強
 */
export function useLiff() {
  const context = useLiffContext();
  const [scanResult, setScanResult] = useState<string | null>(null);

  // 增強掃描功能
  const enhancedScanCode = useCallback(async () => {
    try {
      const result = await context.scanCode();
      setScanResult(result);
      return result;
    } catch (error) {
      console.error('Scan code error:', error);
      return null;
    }
  }, [context]);

  // 增強開啟外部視窗功能
  const openExternalWindow = useCallback((url: string) => {
    if (!url) return;
    context.openExternalWindow?.(url);
  }, [context]);

  // 返回整合後的 LIFF 功能
  return {
    // 基本狀態
    isInitialized: context.isInitialized || false,
    isLoggedIn: context.isLoggedIn || false,
    isInClient: context.isInClient || false,
    error: context.error || null,
    
    // 使用者資訊
    profile: context.profile,
    friendship: context.friendship || { friendFlag: false },
    
    // 系統資訊
    os: context.os || '',
    language: context.language || 'zh-TW',
    liffVersion: context.liffVersion || '',
    lineVersion: context.lineVersion || '',
    
    // 功能方法
    login: context.login || (async () => {}),
    logout: context.logout || (async () => {}),
    closeWindow: context.closeWindow || (() => {}),
    refreshProfile: context.refreshProfile || (async () => {}),
    persistUserData: context.persistUserData || (async () => ({ success: false })),
    
    // 增強功能
    scanCode: enhancedScanCode,
    scanResult,
    openExternalWindow,
  };
}
