'use client';

import { LiffFriendship } from '@/domain/liff/valueObjects/liff-friendship.value';
import { LiffProfile } from '@/domain/liff/valueObjects/liff-profile.value';
import { useCallback, useEffect, useState } from 'react';
import { useLiffContext } from '../providers/LiffProvider'; // 引入新的 Context Hook

// 不再需要 useLiffApplication 輔助 Hook

export function useLiff(liffId?: string) {
  // 從 Context 獲取 liffApplication 實例
  const { liffApplication } = useLiffContext();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInClient, setIsInClient] = useState<boolean>(false);
  const [friendship, setFriendship] = useState<LiffFriendship | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  // --- Initialization Effect ---
  useEffect(() => {
    if (!liffApplication) {
      console.error('LiffApplication instance is not available from context.');
      setError(new Error('LIFF Application context is not available.'));
      setIsInitializing(false);
      setIsReady(false);
      return;
    }

    if (isInitializing) {
      console.log('Initialization already in progress...');
      return;
    }

    let isMounted = true;
    setIsInitializing(true);
    setError(null);
    setIsReady(false);

    console.log('Starting LIFF initialization...');
    liffApplication
      .initializeLiff() // 修正此處，移除多餘參數
      .then(() => {
        if (!isMounted) return;
        console.log('LIFF initialization successful.');
        setIsReady(true);
      })
      .catch((initError) => {
        if (!isMounted) return;
        console.error('LIFF initialization failed:', initError);
        setError(initError instanceof Error ? initError : new Error('Unknown initialization error'));
      })
      .finally(() => {
        if (!isMounted) return;
        setIsInitializing(false);
      });

    return () => {
      isMounted = false;
      console.log('useLiff cleanup: Unmounting or liffId changed.');
    };
  }, [liffApplication, isInitializing]);

  // --- Status Check Effect ---
  useEffect(() => {
    if (!isReady || isInitializing || !liffApplication) { // 增加 liffApplication 檢查
      console.log(`Status check skipped (Ready: ${isReady}, Initializing: ${isInitializing}, App Available: ${!!liffApplication})`);
      return;
    }

    let isMounted = true;
    console.log('LIFF is ready, checking login and client status...');

    const checkStatus = async () => {
      try {
        // 使用從 Context 來的 liffApplication
        const loggedIn = await liffApplication.checkLoginStatus();
        if (!isMounted) return;
        setIsLoggedIn(loggedIn);
        console.log('Logged In Status:', loggedIn);

        const inClient = await liffApplication.isInClientApp();
        if (!isMounted) return;
        setIsInClient(inClient);
        console.log('Is In Client:', inClient);

        if (!loggedIn) {
            setProfile(null);
            setFriendship(null);
        }

      } catch (statusError) {
        if (!isMounted) return;
        console.error('Failed to check LIFF status:', statusError);
        setError(statusError instanceof Error ? statusError : new Error('Failed to check LIFF status'));
        setIsLoggedIn(false);
        setIsInClient(false);
        setProfile(null);
        setFriendship(null);
      }
    };

    checkStatus();

    return () => {
        isMounted = false;
    }
  // 依賴 isReady, isInitializing 和 liffApplication
  }, [isReady, isInitializing, liffApplication]);


  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!isReady || !isLoggedIn || isInitializing || !liffApplication) { // 增加 liffApplication 檢查
       console.log(`Data fetch skipped (Ready: ${isReady}, LoggedIn: ${isLoggedIn}, Initializing: ${isInitializing}, App Available: ${!!liffApplication})`);
       if (isReady && !isLoggedIn) {
           setProfile(null);
           setFriendship(null);
       }
       return;
    }

    let isMounted = true;
    console.log('User is logged in, fetching profile and friendship...');

    const fetchData = async () => {
        // Fetch profile
        try {
          // 使用從 Context 來的 liffApplication
          const userProfile = await liffApplication.getUserProfile();
          if (!isMounted) return;
          setProfile(userProfile);
          console.log('Profile fetched:', userProfile);
        } catch (profileError) {
           if (!isMounted) return;
           console.error('Failed to get profile:', profileError);
           setError(profileError instanceof Error ? profileError : new Error('Failed to get profile'));
           setProfile(null);
        }

        // Fetch friendship status
        try {
          // 使用從 Context 來的 liffApplication
          const friendStatus = await liffApplication.checkFriendship();
          if (!isMounted) return;
          setFriendship(friendStatus);
          console.log('Friendship status fetched:', friendStatus);
        } catch (friendshipError) {
           if (!isMounted) return;
           console.error('Failed to get friendship status:', friendshipError);
           setFriendship(null);
        }
    };

    fetchData();

    return () => {
        isMounted = false;
    }
  // 依賴 isReady, isLoggedIn, isInitializing 和 liffApplication
  }, [isReady, isLoggedIn, isInitializing, liffApplication]);


  // --- Action Callbacks ---

  const login = useCallback(async () => {
    // Added isReady check here for extra safety, although LiffServiceImpl now also checks
    if (!liffApplication || !isReady) {
        const reason = !liffApplication ? 'LiffApplication instance is not available.' : 'LIFF is not ready.';
        console.error(`Cannot login: ${reason}`);
        setError(new Error(`Cannot login: ${reason}`));
        return;
    }
    console.log('Attempting login...');
    try {
      await liffApplication.handleLogin();
      console.log('Login initiated (expecting redirect or state change).');
    } catch (loginError) {
      console.error('LIFF login failed:', loginError);
      setError(loginError instanceof Error ? loginError : new Error('LIFF login failed'));
    }
  }, [liffApplication, isReady]); // Added isReady dependency

  const logout = useCallback(async () => {
    if (!isReady || !isLoggedIn || !liffApplication) { // 增加 liffApplication 檢查
      console.warn(`Cannot logout (Ready: ${isReady}, LoggedIn: ${isLoggedIn}, App Available: ${!!liffApplication})`);
      return;
    }
    console.log('Attempting logout...');
    try {
      // 使用從 Context 來的 liffApplication
      await liffApplication.handleLogout();
      setIsLoggedIn(false);
      setProfile(null);
      setFriendship(null);
      console.log('Logged out successfully.');
    } catch (logoutError) {
      console.error('LIFF logout failed:', logoutError);
      setError(logoutError instanceof Error ? logoutError : new Error('LIFF logout failed'));
    }
  }, [isReady, isLoggedIn, liffApplication]); // 依賴 isReady, isLoggedIn, liffApplication

  const getProfile = useCallback(async (): Promise<LiffProfile | null> => {
     if (!isReady || !isLoggedIn || !liffApplication) { // 增加 liffApplication 檢查
       console.warn(`Cannot get profile (Ready: ${isReady}, LoggedIn: ${isLoggedIn}, App Available: ${!!liffApplication})`);
       return null;
     }
     if (profile) {
         console.log('Returning cached profile.');
         return profile;
     }

     console.log('Fetching fresh profile...');
     try {
       // 使用從 Context 來的 liffApplication
       const userProfile = await liffApplication.getUserProfile();
       setProfile(userProfile);
       return userProfile;
     } catch (profileError) {
       console.error('Failed to get profile:', profileError);
       setError(profileError instanceof Error ? profileError : new Error('Failed to get profile'));
       return null;
     }
   }, [isReady, isLoggedIn, profile, liffApplication]); // 依賴 isReady, isLoggedIn, profile, liffApplication


  const openWindow = useCallback((url: string, external: boolean = true) => {
     // Added isReady check
     if (!liffApplication || !isReady) {
        const reason = !liffApplication ? 'LiffApplication instance is not available.' : 'LIFF is not ready.';
        console.error(`Cannot open window: ${reason}`);
        setError(new Error(`Cannot open window: ${reason}`));
        return;
     }
     console.log(`Opening window: ${url} (External: ${external})`);
     try {
        liffApplication.openExternalWindow(url, external);
     } catch(e) {
        console.error("Failed to open window:", e);
        setError(e instanceof Error ? e : new Error('Failed to open window'));
     }
   }, [liffApplication, isReady]); // Added isReady dependency

  return {
    isReady,
    error,
    profile,
    isLoggedIn,
    isInClient,
    friendship,
    login,
    logout,
    getProfile,
    openWindow,
    isInitializing,
  };
}
