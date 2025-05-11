'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="mb-8 bg-[#00B900]/5 p-6 rounded-lg shadow-sm border border-[#00B900]/20">
        <h1 className="text-2xl font-bold mb-6 text-[#00B900]">LINE 應用控制台</h1>
        <div className="flex space-x-4">
          <Link href="/admin">
            <a className="px-4 py-2 bg-[#00B900] text-white rounded hover:bg-[#009900]">
              管理員入口
            </a>
          </Link>
          <Link href="/client">
            <a className="px-4 py-2 bg-[#00B900] text-white rounded hover:bg-[#009900]">
              客戶入口
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}