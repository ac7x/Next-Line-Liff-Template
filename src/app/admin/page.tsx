'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '儀表板', href: '/admin/dashboard', icon: '📊' },
  { name: '統計分析', href: '/admin/stats', icon: '📈' },
];

function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-white p-4 shadow-lg">
      <h1 className="mb-6 text-center text-xl font-bold">後台管理系統</h1>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center rounded-lg p-3 ${
                  pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        href="/dashboard/profile"
        className="absolute bottom-4 flex w-52 items-center rounded-lg p-3 text-gray-600 hover:bg-gray-50"
      >
        <span className="mr-3">👈</span>
        <span>返回用戶介面</span>
      </Link>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex">
      <AdminNav />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">歡迎來到後台管理系統</h1>
        <p className="mt-4">請選擇左側的功能進行操作。</p>
      </div>
    </div>
  );
}
