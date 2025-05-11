'use client';

import { GlobalBottomNav } from '@/modules/shared/interfaces/navigation/GlobalBottomNav';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="client-layout relative min-h-screen">
      {/* Client-specific layout components */}
      {children}
      
      {/* 只有當不在根路徑時才顯示底部導航 */}
      {pathname !== '/client' && <GlobalBottomNav />}
    </div>
  );
}
