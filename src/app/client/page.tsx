'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: '首頁', href: '/client/home', icon: '🏠' },
  { name: '儀錶板', href: '/client/dashboard', icon: '🧸' },
  { name: '我的', href: '/client/profile', icon: '👤' },
];

export default function ClientPage() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-6 text-2xl font-bold">客戶端導航</h1>
      <nav className="w-full max-w-md">
        <ul className="flex justify-around">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center rounded-lg p-4 ${
                  pathname.startsWith(tab.href) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="mt-2">{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
