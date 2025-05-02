'use client';

import { LiffApplication } from '@/application/liff/liff.application';
import { LiffServiceImpl } from '@/infrastructure/liff/liff.service.impl';
import { createContext, ReactNode, useContext, useMemo } from 'react';

// 1. 建立 Context
interface LiffContextType {
  liffApplication: LiffApplication | null;
}

const LiffContext = createContext<LiffContextType>({ liffApplication: null });

// 2. 建立 Provider 元件
interface LiffProviderProps {
  children: ReactNode;
}

export function LiffProvider({ children }: LiffProviderProps) {
  // 使用 useMemo 確保 LiffApplication 實例在 Provider 生命週期內穩定
  const liffApplicationInstance = useMemo(() => {
    // 這裡負責組合根 (Composition Root) 的職責：實例化基礎設施和應用層服務
    const liffService = new LiffServiceImpl();
    return new LiffApplication(liffService);
  }, []); // 空依賴陣列確保只實例化一次

  const contextValue = useMemo(() => ({
    liffApplication: liffApplicationInstance,
  }), [liffApplicationInstance]);

  return (
    <LiffContext.Provider value={contextValue}>
      {children}
    </LiffContext.Provider>
  );
}

// 3. 建立自訂 Hook 以方便使用 Context
export function useLiffContext(): LiffContextType {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error('useLiffContext must be used within a LiffProvider');
  }
  // 可以在這裡增加對 liffApplication 是否為 null 的檢查，如果需要確保它總是被初始化
  // if (context.liffApplication === null) {
  //   // 這不應該發生，因為 Provider 總會提供一個實例
  //   throw new Error('LiffApplication instance is null within LiffProvider');
  // }
  return context;
}
