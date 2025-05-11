'use client';

import { saveUserProfile } from '@/modules/liff/application/actions/user-profile.actions';
import { LiffProfile as LiffProfileValueObject } from '@/modules/liff/domain/valueObjects/liff-profile';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import LiffClient from '../client';

// 動態取得 liffId，優先取 NEXT_PUBLIC_LIFF_ID，否則 fallback 到 LINE_LIFF_ID
const liffId =
  process.env.NEXT_PUBLIC_LIFF_ID ||
  process.env.LINE_LIFF_ID ||
  '';

// --- 環境變數偵錯輸出 ---
console.log('[LiffContext] 使用的 LIFF ID:', liffId);

interface LiffContextValue {
  profile: LiffProfileValueObject;
  friendship: { friendFlag: boolean };
  isInitialized: boolean;
  error: string | null;
  isLoggedIn: boolean;
  isInClient: boolean;
  os: string;
  language: string;
  liffVersion: string;
  lineVersion: string;
  refreshProfile: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  closeWindow: () => void;
  openExternalWindow: (url: string) => void;
  scanCode: () => Promise<string | null>;
  persistUserData: () => Promise<{ success: boolean; userId?: string }>;
}

const defaultContextValue: LiffContextValue = {
  profile: LiffProfileValueObject.createDefault(),
  friendship: { friendFlag: false },
  isInitialized: false,
  error: null,
  isLoggedIn: false,
  isInClient: false,
  os: '',
  language: '',
  liffVersion: '',
  lineVersion: '',
  refreshProfile: async () => { },
  login: async () => { },
  logout: async () => { },
  closeWindow: () => { },
  openExternalWindow: () => { },
  scanCode: async () => null,
  persistUserData: async () => ({ success: false }),
};

const LiffContext = createContext<LiffContextValue>(defaultContextValue);

export function LiffContextProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LiffProfileValueObject>(
    LiffProfileValueObject.createDefault()
  );
  const [friendship, setFriendship] = useState<{ friendFlag: boolean }>({ friendFlag: false });
  const [isLiffLoggedIn, setIsLiffLoggedIn] = useState(false);
  const [isLiffInClient, setIsLiffInClient] = useState(false);
  const [osType, setOsType] = useState('');
  const [languageType, setLanguageType] = useState('');
  const [liffVersionValue, setLiffVersionValue] = useState('');
  const [lineVersionValue, setLineVersionValue] = useState('');

  const refreshProfile = useCallback(async () => {
    if (isInitialized && isLiffLoggedIn) {
      try {
        console.log('正在獲取 LINE 用戶資料...');
        const profileData = await LiffClient.getProfile();
        console.log('成功獲取用戶資料:', profileData);
        
        const friendshipData = await LiffClient.getFriendship();
        console.log('獲取好友關係狀態:', friendshipData);
        
        setProfile(LiffProfileValueObject.fromLiffProfile(profileData));
        setFriendship(friendshipData);
        
        // 在獲取最新資料後立即保存到資料庫
        const profileDto = {
          userId: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl,
          statusMessage: profileData.statusMessage,
        };
        
        await saveUserProfile(profileDto);
        console.log('用戶資料自動保存完成');
      } catch (error) {
        console.error('刷新用戶資料時發生錯誤:', error);
      }
    }
  }, [isInitialized, isLiffLoggedIn]);

  const handleLogout = useCallback(async () => {
    try {
      console.log('用戶登出中...');
      LiffClient.logout();
      setIsLiffLoggedIn(false);
      setProfile(LiffProfileValueObject.createDefault());
      setFriendship({ friendFlag: false });
      console.log('用戶已成功登出並清除資料');
      
      // 可以在這裡加入登出後的其他處理，例如資料清理或跳轉
    } catch (error) {
      console.error('登出過程中發生錯誤:', error);
    }
  }, []);

  const handleOpenExternalWindow = useCallback(
    (url: string) => LiffClient.openWindow({ url, external: true }),
    []
  );

  const handlePersistUserData = useCallback(async () => {
    try {
      if (!isLiffLoggedIn || !profile.userId) {
        console.warn('無法保存用戶資料: 用戶尚未登入或缺少用戶ID');
        return { success: false, message: 'Not logged in' };
      }
      
      console.log('準備保存用戶資料:', profile);

      const profileDto = {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };

      const result = await saveUserProfile(profileDto);
      
      if (result.success) {
        console.log('用戶資料保存成功:', result);
      } else {
        console.warn('用戶資料保存失敗:', result);
      }
      
      return result;
    } catch (err) {
      console.error('Error saving user profile:', err);
      return { success: false };
    }
  }, [isLiffLoggedIn, profile]);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // --- 初始化前輸出 liffId 狀態 ---
        console.log('[LiffContext] Initializing LIFF with liffId:', liffId);
        await LiffClient.init({ liffId });
        setIsInitialized(true);
        setIsLiffLoggedIn(LiffClient.isLoggedIn());
        setIsLiffInClient(LiffClient.isInClient());
        setOsType(LiffClient.getOS() || '');
        setLanguageType(LiffClient.getLanguage());
        setLiffVersionValue(LiffClient.getVersion());
        setLineVersionValue(LiffClient.getLineVersion() || '');
        if (LiffClient.isLoggedIn()) {
          await refreshProfile();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error during LIFF initialization';
        setError(errorMessage);
        // --- 詳細錯誤輸出 ---
        console.error('[LiffContext] LIFF initialization error:', errorMessage, err);

        // 處理特定錯誤
        if (errorMessage.includes('no login bot linked')) {
          const message = '請確保已在 LINE Developers Console 中正確設定並連結 LINE Bot。';
          setError(`${errorMessage} - ${message}`);

          // 嘗試自動修復（可選）
          try {
            // 這裡可以實現自動重新初始化的邏輯
          } catch (repairError) {
            console.error('嘗試修復失敗:', repairError);
          }
        }
      }
    };

    initializeLiff();
  }, [refreshProfile, liffId]);

  const contextValue: LiffContextValue = {
    profile,
    friendship,
    isInitialized,
    error,
    isLoggedIn: isLiffLoggedIn,
    isInClient: isLiffInClient,
    os: osType,
    language: languageType,
    liffVersion: liffVersionValue,
    lineVersion: lineVersionValue,
    refreshProfile,
    login: LiffClient.login,
    logout: handleLogout,
    closeWindow: LiffClient.closeWindow,
    openExternalWindow: handleOpenExternalWindow,
    scanCode: LiffClient.scanCode,
    persistUserData: handlePersistUserData,
  };

  return <LiffContext.Provider value={contextValue}>{children}</LiffContext.Provider>;
}

export const useLiffContext = () => useContext(LiffContext);
