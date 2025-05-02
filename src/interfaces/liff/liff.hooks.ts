'use client';

import { LiffApplication } from '@/application/liff/liff.application';
import { LiffFriendship } from '@/domain/liff/valueObjects/liff-friendship.value';
import { LiffProfile } from '@/domain/liff/valueObjects/liff-profile.value';
import { LiffServiceImpl } from '@/infrastructure/liff/liff.service.impl';
import { useCallback, useEffect, useState } from 'react';

// Instantiate outside or use context/DI for better management
const liffService = new LiffServiceImpl();
const liffApplication = new LiffApplication(liffService);

export function useLiff(liffId?: string) { // Make liffId optional if needed
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInClient, setIsInClient] = useState<boolean>(false);
  const [friendship, setFriendship] = useState<LiffFriendship | null>(null);

  // Memoize application instance if needed, though here it's created outside
  // const liffApplication = useMemo(() => new LiffApplication(new LiffServiceImpl()), []);

  useEffect(() => {
    if (!liffId) {
      console.warn('LIFF ID is missing.');
      setError(new Error('LIFF ID is missing.'));
      setIsReady(false); // Ensure ready is false if no ID
      return;
    }

    let isMounted = true; // Prevent state updates on unmounted component

    const initialize = async () => {
      try {
        console.log(`Initializing LIFF with ID: ${liffId}`);
        await liffApplication.initializeLiff(liffId);
        if (!isMounted) return;

        console.log('LIFF Initialized. Checking status...');
        setIsReady(true);
        setError(null); // Clear previous errors

        // Check status after initialization
        const loggedIn = await liffApplication.checkLoginStatus();
        if (!isMounted) return;
        setIsLoggedIn(loggedIn);
        console.log('Logged In Status:', loggedIn);

        const inClient = await liffApplication.isInClientApp();
        if (!isMounted) return;
        setIsInClient(inClient);
        console.log('Is In Client:', inClient);

        if (loggedIn) {
          // Fetch profile and friendship only if logged in
          try {
            const userProfile = await liffApplication.getUserProfile();
            if (!isMounted) return;
            setProfile(userProfile);
            console.log('Profile fetched:', userProfile);
          } catch (profileError) {
             if (!isMounted) return;
             console.error('Failed to get profile:', profileError);
             setError(profileError instanceof Error ? profileError : new Error('Failed to get profile'));
             // Decide if logout is needed on profile error
             // await logout();
          }

          try {
            const friendStatus = await liffApplication.checkFriendship();
            if (!isMounted) return;
            setFriendship(friendStatus);
            console.log('Friendship status fetched:', friendStatus);
          } catch (friendshipError) {
             if (!isMounted) return;
             console.error('Failed to get friendship status:', friendshipError);
             // Don't necessarily set main error state for this?
          }
        } else {
           // Not logged in, clear profile/friendship
           setProfile(null);
           setFriendship(null);
        }

      } catch (initError) {
        if (!isMounted) return;
        console.error('LIFF initialization failed:', initError);
        setError(initError instanceof Error ? initError : new Error('LIFF initialization failed'));
        setIsReady(false); // Ensure ready is false on error
      }
    };

    initialize();

    return () => {
      isMounted = false; // Cleanup function
      console.log('useLiff cleanup');
    };
  }, [liffId]); // Re-run effect if liffId changes

  const login = useCallback(async () => {
    if (!isReady) {
      console.warn('LIFF not ready, cannot login.');
      return;
    }
    try {
      await liffApplication.handleLogin();
      // After login, LIFF usually reloads the page.
      // If not, manually re-check status and fetch profile.
      // const loggedIn = await liffApplication.checkLoginStatus();
      // setIsLoggedIn(loggedIn);
      // if (loggedIn) {
      //   const userProfile = await liffApplication.getUserProfile();
      //   setProfile(userProfile);
      //   const friendStatus = await liffApplication.checkFriendship();
      //   setFriendship(friendStatus);
      // }
    } catch (loginError) {
      console.error('LIFF login failed:', loginError);
      setError(loginError instanceof Error ? loginError : new Error('LIFF login failed'));
    }
  }, [isReady]);

  const logout = useCallback(async () => {
    if (!isReady || !isLoggedIn) {
      console.warn('LIFF not ready or not logged in, cannot logout.');
      return;
    }
    try {
      await liffApplication.handleLogout();
      // Update state after logout
      setIsLoggedIn(false);
      setProfile(null);
      setFriendship(null);
      console.log('Logged out successfully.');
    } catch (logoutError) {
      console.error('LIFF logout failed:', logoutError);
      setError(logoutError instanceof Error ? logoutError : new Error('LIFF logout failed'));
    }
  }, [isReady, isLoggedIn]);

  const getProfile = useCallback(async (): Promise<LiffProfile | null> => {
     if (!isReady || !isLoggedIn) {
       console.warn('LIFF not ready or not logged in, cannot get profile.');
       return null;
     }
     if (profile) return profile; // Return cached profile if available

     try {
       const userProfile = await liffApplication.getUserProfile();
       setProfile(userProfile); // Update state cache
       return userProfile;
     } catch (profileError) {
       console.error('Failed to get profile:', profileError);
       setError(profileError instanceof Error ? profileError : new Error('Failed to get profile'));
       return null;
     }
   }, [isReady, isLoggedIn, profile]);


  // Expose application methods directly
  const openWindow = useCallback((url: string, external: boolean = true) => {
     if (!isReady) {
       console.warn('LIFF not ready, cannot open window.');
       return;
     }
     liffApplication.openExternalWindow(url, external);
   }, [isReady]);

  return {
    isReady,
    error,
    profile,
    isLoggedIn, // Expose state
    isInClient, // Expose state
    friendship, // Expose state
    login,
    logout,
    getProfile, // Keep explicit fetch if needed
    openWindow, // Expose method
    // Expose other application methods as needed
    // e.g., checkFriendship: liffApplication.checkFriendship
  };
}
