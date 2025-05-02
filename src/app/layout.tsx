import type { Metadata } from 'next';
import './globals.css';
// Remove direct import of LiffProvider
// import { LiffProvider } from '@/interfaces/liff/providers/LiffProvider';
import { GlobalProviders } from '@/interfaces/navigation/GlobalProviders'; // Import GlobalProviders

export const metadata: Metadata = {
  title: 'Line LIFF Demo',
  description: 'Line LIFF Demo with Next.js 14 App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Use GlobalProviders to wrap children */}
        <GlobalProviders>
          {children}
          {/* You might want to include layout elements like GlobalBottomNav here */}
          {/* e.g., <GlobalBottomNav /> */}
        </GlobalProviders>
      </body>
    </html>
  );
}
