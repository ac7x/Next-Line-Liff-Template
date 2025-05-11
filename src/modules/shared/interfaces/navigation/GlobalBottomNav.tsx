'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: '首頁', href: '/client/home', icon: '🏠' },
  { name: '儀錶板', href: '/client/dashboard', icon: '🧸' },
  { name: '我的', href: '/client/profile', icon: '👤' },
];

/**
 * A global bottom navigation bar component.
 */
export function GlobalBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg">
      <ul className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`flex flex-col items-center justify-center h-full ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs mt-1">{tab.name}</span>
                {isActive && <div className="absolute bottom-0 w-1/4 h-0.5 bg-blue-600 rounded-t-md" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

// Note: You would typically import and place <GlobalBottomNav /> within your layout
// (e.g., inside GlobalProviders in layout.tsx or a specific page layout)
// Ensure your main content area has appropriate padding-bottom to avoid overlap.
