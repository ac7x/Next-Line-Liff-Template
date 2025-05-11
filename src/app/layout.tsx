import { Providers } from '@/modules/shared/interfaces/navigation/GlobalProviders';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Line LIFF Demo',
  description: 'Line LIFF Demo with Next.js 14 App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
