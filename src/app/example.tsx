'use client';

import { useLiff } from '@/interfaces/liff/liff.hooks';

export default function LiffDemo() {
  const { isReady, profile, login, getProfile } = useLiff('your-liff-id');

  useEffect(() => {
    if (isReady) {
      getProfile();
    }
  }, [isReady]);

  if (!isReady) return <div>Loading...</div>;

  return (
    <div>
      {profile ? (
        <div>Welcome, {profile.value.displayName}!</div>
      ) : (
        <button onClick={login}>Log in</button>
      )}
    </div>
  );
}
