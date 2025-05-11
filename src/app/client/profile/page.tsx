'use client'; // Make this a Client Component

import { useLiff } from '@/modules/liff/interfaces/hooks/liff.hook';
import Image from 'next/image'; // Import Image for profile picture
import { useEffect, useState } from 'react';

// Get LIFF ID from environment variables (ensure it's available client-side)
const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

export default function ProfilePage() {
  // Use the hook, passing the LIFF ID
  const { isInitialized, isLoggedIn, profile, login, logout, error, friendship } = useLiff();
  
  // 狀態追蹤提示訊息顯示
  const [showInitSuccess, setShowInitSuccess] = useState(false);
  const [showBotConnected, setShowBotConnected] = useState(false);
  
  // 監聽 LIFF 初始化狀態
  useEffect(() => {
    if (isInitialized) {
      setShowInitSuccess(true);
      // 3秒後隱藏初始化成功提示
      const timer = setTimeout(() => {
        setShowInitSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);
  
  // 監聽 LINE Bot 連接狀態
  useEffect(() => {
    if (isInitialized && isLoggedIn && friendship.friendFlag) {
      setShowBotConnected(true);
      // 3秒後隱藏 Bot 連接成功提示
      const timer = setTimeout(() => {
        setShowBotConnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoggedIn, friendship.friendFlag]);

  // Handle loading and initialization states
  if (!isInitialized) {
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
        <p className="text-red-600">{error}</p>
        {!liffId && <p className="mt-2 text-sm text-red-500">請檢查 LIFF ID 環境變數是否已設定。</p>}
      </div>
    );
  }

  // Handle case where LIFF is ready but not logged in
  if (isInitialized && !isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        {/* 顯示初始化成功提示 */}
        {showInitSuccess && (
          <div className="absolute top-4 right-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded shadow-md">
            LIFF 已成功初始化
          </div>
        )}
        
        <h1 className="mb-4 text-3xl font-bold">請先登入</h1>
        <p className="mb-6 text-lg text-gray-600">登入以查看您的個人資料。</p>
        <button
          onClick={() => login()} // 不帶 redirectUri，登入後不跳轉
          className="rounded bg-blue-500 px-6 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          使用 LINE 登入
        </button>
      </div>
    );
  }

  // Handle case where LIFF is ready and logged in
  if (isInitialized && isLoggedIn && profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 relative">
        {/* 顯示初始化成功提示 */}
        {showInitSuccess && (
          <div className="absolute top-4 right-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded shadow-md transition-opacity duration-300">
            LIFF 已成功初始化
          </div>
        )}
        
        {/* 顯示 LINE Bot 連接成功提示 */}
        {showBotConnected && (
          <div className="absolute top-16 right-4 bg-[#00B900]/10 border border-[#00B900]/30 text-[#00B900] px-4 py-2 rounded shadow-md transition-opacity duration-300">
            LINE Bot 已成功連接
          </div>
        )}
        
        <h1 className="mb-6 text-3xl font-bold">我的個人資料</h1>
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-md">
          {profile.pictureUrl && (
            <Image
              src={profile.pictureUrl}
              alt="Profile Picture"
              width={96}
              height={96}
              className="mx-auto mb-4 rounded-full"
            />
          )}
          <h2 className="mb-2 text-2xl font-semibold">{profile.displayName}</h2>
          {profile.statusMessage && (
            <p className="mb-4 text-gray-500">{profile.statusMessage}</p>
          )}
          <p className="text-sm text-gray-400">User ID: {profile.userId}</p>
          
          {/* LINE Bot 狀態資訊 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">LINE Bot 狀態:</p>
            <div className={`inline-flex items-center px-2 py-1 rounded ${friendship.friendFlag ? 'bg-[#00B900]/10 text-[#00B900]' : 'bg-gray-100 text-gray-500'}`}>
              {friendship.friendFlag ? '已連接' : '未連接'}
            </div>
          </div>
          
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
      <p className="text-lg text-gray-600 mb-4">載入個人資料中...</p>
      
      {/* 診斷狀態顯示 */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow w-full max-w-md">
        <h2 className="font-medium mb-2">LIFF 狀態診斷</h2>
        <div className="text-sm space-y-1">
          <p>Initialized: <span className={isInitialized ? "text-green-500 font-medium" : "text-yellow-500"}>{isInitialized ? "true" : "false"}</span></p>
          <p>LoggedIn: <span className={isLoggedIn ? "text-green-500 font-medium" : "text-gray-500"}>{isLoggedIn ? "true" : "false"}</span></p>
          <p>LIFF ID: <span className="font-mono text-xs">{liffId || "未設定"}</span></p>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          重新整理頁面
        </button>
      </div>
    </div>
  );
}
