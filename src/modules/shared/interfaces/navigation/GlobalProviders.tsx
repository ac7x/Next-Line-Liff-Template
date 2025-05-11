'use client'; // Providers managing client-side state often need to be client components

import { LiffProvider } from '@/modules/liff/interfaces/providers/LiffProvider';
import { ReactNode } from 'react';
// import { AnotherProvider } from '@/interfaces/another/providers/AnotherProvider'; // Example for future providers

interface GlobalProvidersProps {
  children: ReactNode;
}

/**
 * Wraps the application with all necessary global context providers.
 */
export function GlobalProviders({ children }: GlobalProvidersProps) {
  return (
    <LiffProvider>
      {/* <AnotherProvider> */}
        {/* Add other global providers here */}
        {children}
      {/* </AnotherProvider> */}
    </LiffProvider>
  );
}
