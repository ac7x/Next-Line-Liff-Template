'use client'; // Make this a Client Component

import { useLiff } from '@/modules/liff/interfaces/liff.hooks'; // Import the hook
import Image from 'next/image'; // Import Image for profile picture

// Get LIFF ID from environment variables (ensure it's available client-side)
const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

export default function ProfilePage() {
  // Use the hook, passing the LIFF ID
  const { isReady, isLoggedIn, profile, login, logout, error, isInitializing } = useLiff(liffId);

  // Handle loading and initialization states
  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-lg text-gray-600">LIFF 初始化中...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4">
        <h1 className="mb-4 text-xl font-bold text-red-700">發生錯誤</h1>
        <p className="text-red-600">{error.message}</p>
        {!liffId && <p className="mt-2 text-sm text-red-500">請檢查 LIFF ID 環境變數是否已設定。</p>}
      </div>
    );
  }

  // Handle case where LIFF is ready but not logged in
  if (isReady && !isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="mb-4 text-3xl font-bold">請先登入</h1>
        <p className="mb-6 text-lg text-gray-600">登入以查看您的個人資料。</p>
        <button
          onClick={() => login()} // Call the login function from the hook
          className="rounded bg-blue-500 px-6 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          使用 LINE 登入
        </button>
      </div>
    );
  }

  // Handle case where LIFF is ready and logged in
  if (isReady && isLoggedIn && profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="mb-6 text-3xl font-bold">我的個人資料</h1>
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-md">
          {profile.value.pictureUrl && (
            <Image
              src={profile.value.pictureUrl}
              alt="Profile Picture"
              width={96}
              height={96}
              className="mx-auto mb-4 rounded-full"
            />
          )}
          <h2 className="mb-2 text-2xl font-semibold">{profile.value.displayName}</h2>
          {profile.value.statusMessage && (
            <p className="mb-4 text-gray-500">{profile.value.statusMessage}</p>
          )}
          <p className="text-sm text-gray-400">User ID: {profile.value.userId}</p>
          <button
            onClick={() => logout()} // Call the logout function
            className="mt-6 rounded bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            登出
          </button>
        </div>
      </div>
    );
  }

  // Default loading state (before isReady or if profile is null unexpectedly)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <p className="text-lg text-gray-600">載入個人資料中...</p>
    </div>
  );
}
