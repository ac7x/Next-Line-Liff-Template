'use client';

import { LiffContextProvider } from '@/modules/liff/interfaces/contexts/LiffContext';
import { GlobalBottomNav } from '@/modules/shared/interfaces/navigation/GlobalBottomNav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LiffContextProvider>
        {children}
        <GlobalBottomNav />
      </LiffContextProvider>
    </QueryClientProvider>
  );
}
