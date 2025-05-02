import { useCallback, useState } from 'react';
import { useLiffContext } from '../contexts/LiffContext';

export function useLiff() {
  const context = useLiffContext();
  const [scanResult, setScanResult] = useState<string | null>(null);

  // 只增強原有 Context 的功能，不重複實現
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

  // 只返回與原 Context 不同的屬性，其餘保持原樣
  return {
    ...context,
    scanResult,
    scanCode: enhancedScanCode,
  };
}
