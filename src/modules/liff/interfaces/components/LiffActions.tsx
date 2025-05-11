import { useState } from 'react';

interface LiffActionsProps {
  isLoggedIn: boolean;
  scanResult: string | null;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  onOpenWindow: (url: string) => void;
  onCloseWindow: () => void;
  onScanCode: () => Promise<string | null>;
}

export function LiffActions({
  isLoggedIn,
  scanResult,
  onLogin,
  onLogout,
  onOpenWindow,
  onCloseWindow,
  onScanCode,
}: LiffActionsProps) {
  const [url, setUrl] = useState<string>('');

  const handleScanCode = async () => {
    const result = await onScanCode();
    if (result) {
      setUrl(result);
    }
  };

  return (
    <div className="w-full">
      <h4 className="mb-2 text-lg font-bold">Actions</h4>
      <div className="flex flex-wrap gap-2">
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="rounded bg-[#00B900] px-4 py-2 text-white hover:bg-[#009900] transition-colors"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="rounded bg-[#00B900] px-4 py-2 text-white hover:bg-[#009900] transition-colors"
          >
            Login
          </button>
        )}
        <button
          onClick={() => onOpenWindow('https://www.google.com/')}
          className="rounded bg-[#00B900] px-4 py-2 text-white hover:bg-[#009900] transition-colors"
        >
          Open external window
        </button>
        <button
          onClick={onCloseWindow}
          className="rounded bg-[#00B900] px-4 py-2 text-white hover:bg-[#009900] transition-colors"
        >
          Close window
        </button>
        <button
          onClick={handleScanCode}
          className="rounded bg-[#00B900] px-4 py-2 text-white hover:bg-[#009900] transition-colors"
        >
          Scan QR code
        </button>
      </div>
      <div className="mt-4">Scan result: {url || scanResult}</div>
    </div>
  );
}
