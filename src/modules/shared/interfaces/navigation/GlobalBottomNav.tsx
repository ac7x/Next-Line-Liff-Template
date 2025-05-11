'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavItem {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

interface GlobalBottomNavProps {
  items?: NavItem[];
}

export function GlobalBottomNav({ items = defaultNavItems }: GlobalBottomNavProps) {
  const pathname = usePathname();

  // 預設 NavItem 如果沒有提供
  const navItems = items.length > 0 ? items : defaultNavItems.map(item => ({
    ...item,
    active: pathname === item.href
  }));

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full grid-cols-4 mx-auto">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-5 ${
              item.active ? 'text-[#00B900]' : 'text-gray-500 hover:text-[#00B900]'
            }`}
          >
            <div className="text-2xl">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 預設導航項目
const defaultNavItems: NavItem[] = [
  {
    href: '/client/home',
    icon: '🏠',
    label: '首頁',
    active: false
  },
  {
    href: '/client/dashboard',
    icon: '📊',
    label: '儀表板',
    active: false
  },
  {
    href: '/client/profile',
    icon: '👤',
    label: '我的',
    active: false
  },
  {
    href: '/client/settings',
    icon: '⚙️',
    label: '設定',
    active: false
  }
];
