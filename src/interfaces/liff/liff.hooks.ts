'use client';

import { LiffApplication } from '@/application/liff/liff.application';
import { LiffFriendship } from '@/domain/liff/valueObjects/liff-friendship.value';
import { LiffProfile } from '@/domain/liff/valueObjects/liff-profile.value';
import { LiffServiceImpl } from '@/infrastructure/liff/liff.service.impl';
import { useCallback, useEffect, useRef, useState } from 'react'; // Added useRef

// Instantiate outside or use context/DI for better management
// Use useRef to ensure the instance persists across re-renders without causing re-initialization
const useLiffApplication = () => {
  const appRef = useRef<LiffApplication | null>(null);
  if (!appRef.current) {
    const liffService = new LiffServiceImpl();
    appRef.current = new LiffApplication(liffService);
  }
  return appRef.current;
};


export function useLiff(liffId?: string) {
  const liffApplication = useLiffApplication(); // Get persistent instance
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInClient, setIsInClient] = useState<boolean>(false);
  const [friendship, setFriendship] = useState<LiffFriendship | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false); // Track initialization state

  // --- Initialization Effect ---
  useEffect(() => {
    if (!liffId) {
      console.warn('LIFF ID is missing.');
      setError(new Error('LIFF ID is missing.'));
      setIsReady(false);
      setIsInitializing(false); // Not initializing if no ID
      return;
    }

    // Prevent starting initialization if already in progress
    if (isInitializing) {
        console.log('Initialization already in progress...');
        return;
    }

    let isMounted = true;
    setIsInitializing(true); // Mark as initializing
    setError(null); // Clear previous errors
    setIsReady(false); // Reset ready state

    console.log(`Starting LIFF initialization with ID: ${liffId}`);
    liffApplication.initializeLiff(liffId)
      .then(() => {
        if (!isMounted) return;
        console.log('LIFF initialization successful (initializeLiff resolved).');
        setIsReady(true); // Mark as ready
        setError(null);
      })
      .catch((initError) => {
        if (!isMounted) return;
        console.error('LIFF initialization failed:', initError);
        setError(initError instanceof Error ? initError : new Error('LIFF initialization failed'));
        setIsReady(false); // Ensure ready is false on error
      })
      .finally(() => {
         if (!isMounted) return;
         setIsInitializing(false); // Mark initialization as complete (success or fail)
      });

    return () => {
      isMounted = false;
      console.log('useLiff cleanup: Unmounting or liffId changed.');
      // Optional: Add cleanup logic if needed, though LIFF itself doesn't have a destroy method
    };
    // Re-run ONLY if liffId changes. liffApplication instance is stable due to useRef.
  }, [liffId, liffApplication, isInitializing]); // Add isInitializing to dependencies


  // --- Status Check Effect (Runs after initialization completes) ---
  useEffect(() => {
    // Only run if LIFF is ready and initialization isn't currently running
    if (!isReady || isInitializing) {
      console.log(`Status check skipped (Ready: ${isReady}, Initializing: ${isInitializing})`);
      return;
    }

    let isMounted = true;
    console.log('LIFF is ready, checking login and client status...');

    const checkStatus = async () => {
      try {
        const loggedIn = await liffApplication.checkLoginStatus();
        if (!isMounted) return;
        setIsLoggedIn(loggedIn);
        console.log('Logged In Status:', loggedIn);

        const inClient = await liffApplication.isInClientApp();
        if (!isMounted) return;
        setIsInClient(inClient);
        console.log('Is In Client:', inClient);

        // Clear profile/friendship if not logged in
        if (!loggedIn) {
            setProfile(null);
            setFriendship(null);
        }

      } catch (statusError) {
        if (!isMounted) return;
        console.error('Failed to check LIFF status:', statusError);
        setError(statusError instanceof Error ? statusError : new Error('Failed to check LIFF status'));
        // Reset states on error?
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
  // Depend on isReady and isInitializing to trigger after init completes
  }, [isReady, isInitializing, liffApplication]);


  // --- Data Fetching Effect (Runs after login status is confirmed) ---
  useEffect(() => {
    // Only run if LIFF is ready, user is logged in, and not currently initializing
    if (!isReady || !isLoggedIn || isInitializing) {
       console.log(`Data fetch skipped (Ready: ${isReady}, LoggedIn: ${isLoggedIn}, Initializing: ${isInitializing})`);
       // Clear data if logged out while ready
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
          const userProfile = await liffApplication.getUserProfile(); // getUserProfile handles login check internally now
          if (!isMounted) return;
          setProfile(userProfile);
          console.log('Profile fetched:', userProfile);
        } catch (profileError) {
           if (!isMounted) return;
           console.error('Failed to get profile:', profileError);
           setError(profileError instanceof Error ? profileError : new Error('Failed to get profile'));
           // Optional: Logout or clear profile on error?
           setProfile(null);
        }

        // Fetch friendship status
        try {
          const friendStatus = await liffApplication.checkFriendship();
          if (!isMounted) return;
          setFriendship(friendStatus);
          console.log('Friendship status fetched:', friendStatus);
        } catch (friendshipError) {
           if (!isMounted) return;
           console.error('Failed to get friendship status:', friendshipError);
           // Don't necessarily set main error state for this, maybe just log
           setFriendship(null); // Indicate failure to get status
        }
    };

    fetchData();

    return () => {
        isMounted = false;
    }
  // Depend on isReady, isLoggedIn, and isInitializing
  }, [isReady, isLoggedIn, isInitializing, liffApplication]);


  // --- Action Callbacks ---

  const login = useCallback(async () => {
    // Allow login attempt even if not fully ready, LIFF SDK might handle it.
    // Or add readiness check: if (!isReady) { console.warn(...); return; }
    console.log('Attempting login...');
    try {
      // Let the application layer handle the logic
      await liffApplication.handleLogin();
      // LIFF handles the redirect. State updates will happen naturally
      // upon return and re-initialization/status checks.
      console.log('Login initiated (expecting redirect or state change).');
    } catch (loginError) {
      console.error('LIFF login failed:', loginError);
      setError(loginError instanceof Error ? loginError : new Error('LIFF login failed'));
    }
  }, [liffApplication]); // Depends only on the stable application instance

  const logout = useCallback(async () => {
    if (!isReady || !isLoggedIn) {
      console.warn('LIFF not ready or not logged in, cannot logout.');
      return;
    }
    console.log('Attempting logout...');
    try {
      await liffApplication.handleLogout();
      // Manually update state immediately after successful logout call
      setIsLoggedIn(false);
      setProfile(null);
      setFriendship(null);
      console.log('Logged out successfully.');
    } catch (logoutError) {
      console.error('LIFF logout failed:', logoutError);
      setError(logoutError instanceof Error ? logoutError : new Error('LIFF logout failed'));
    }
  }, [isReady, isLoggedIn, liffApplication]); // Depends on changing state and stable instance

  const getProfile = useCallback(async (): Promise<LiffProfile | null> => {
     if (!isReady || !isLoggedIn) {
       console.warn('LIFF not ready or not logged in, cannot get profile.');
       return null;
     }
     // Return cached profile first if available and matches current state
     if (profile) {
         console.log('Returning cached profile.');
         return profile;
     }

     // If no cache, fetch fresh data
     console.log('Fetching fresh profile...');
     try {
       const userProfile = await liffApplication.getUserProfile();
       // Update state cache only if component is still mounted (though less critical in useCallback)
       setProfile(userProfile); // Update state cache
       return userProfile;
     } catch (profileError) {
       console.error('Failed to get profile:', profileError);
       setError(profileError instanceof Error ? profileError : new Error('Failed to get profile'));
       return null;
     }
   }, [isReady, isLoggedIn, profile, liffApplication]); // Depends on changing state and stable instance


  const openWindow = useCallback((url: string, external: boolean = true) => {
     // Allow opening window even if not fully ready? LIFF SDK might handle.
     // Or add readiness check: if (!isReady) { console.warn(...); return; }
     console.log(`Opening window: ${url} (External: ${external})`);
     try {
        liffApplication.openExternalWindow(url, external);
     } catch(e) {
        // Catch potential error from service impl if instance not ready
        console.error("Failed to open window:", e);
        setError(e instanceof Error ? e : new Error('Failed to open window'));
     }
   }, [liffApplication]); // Depends only on stable instance

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
    // Expose initialization status if needed for UI feedback
    isInitializing,
  };
}
