import { useCallback, useState } from 'react';
import { useLiffContext } from '../contexts/LiffContext';

/**
 * 使用 LIFF 的 hook，封裝 LIFF 相關功能
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

  // 返回整合後的 LIFF 功能
  return {
    ...context,
    scanResult,
    scanCode: enhancedScanCode,
  };
}
