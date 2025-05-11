'use client';

import { LiffContextProvider } from '@/modules/liff/interfaces/contexts/liff-context.provider';
import { GlobalBottomNav } from '@/modules/shared/interfaces/navigation/GlobalBottomNav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LiffContextProvider>
        {children}
        {/* 置中下方導航 */}
        <div className="flex justify-center w-full">
          <GlobalBottomNav />
        </div>
      </LiffContextProvider>
    </QueryClientProvider>
  );
}
