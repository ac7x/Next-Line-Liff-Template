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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">LINE LIFF App</h1>
        <p className="text-gray-600">歡迎使用我們的 LINE 整合應用</p>
      </div>

      <nav className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">請選擇功能</h2>
        <ul className="grid grid-cols-1 gap-4">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex items-center p-4 rounded-lg transition-all ${
                  pathname.startsWith(tab.href) 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <span className="text-2xl mr-4">{tab.icon}</span>
                <div>
                  <span className="font-medium">{tab.name}</span>
                  {tab.name === '首頁' && <p className="text-xs text-gray-500">探索所有功能</p>}
                  {tab.name === '儀錶板' && <p className="text-xs text-gray-500">查看個人數據</p>}
                  {tab.name === '我的' && <p className="text-xs text-gray-500">管理個人資訊</p>}
                </div>
                <span className="ml-auto text-gray-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <p className="text-sm text-gray-500 mt-8">使用 Next.js 15 & LINE LIFF SDK</p>
    </div>
  );
}
